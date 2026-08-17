#!/usr/bin/env node
import { lstat, readFile, readdir, realpath } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const v2Root = path.resolve(scriptDir, '..')
const repoRoot = path.resolve(v2Root, '..')
const v2Boundary = `${v2Root}${path.sep}`
const legacyRoots = ['FrontEnd', 'BackEnd', 'DataBase']
const scanRoots = ['src', 'scripts', 'public']
const textExtensions = new Set([
  '.css',
  '.html',
  '.js',
  '.jsx',
  '.json',
  '.mjs',
  '.mdx',
  '.scss',
  '.ts',
  '.tsx',
])

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function insideV2(target) {
  const resolved = path.resolve(target)
  return resolved === v2Root || resolved.startsWith(v2Boundary)
}

async function walk(relativeRoot) {
  const root = path.join(v2Root, relativeRoot)
  const files = []
  const stack = [root]

  while (stack.length > 0) {
    const current = stack.pop()
    const entries = await readdir(current, { withFileTypes: true })

    for (const entry of entries) {
      const target = path.join(current, entry.name)
      const metadata = await lstat(target)

      assert(!metadata.isSymbolicLink(), `V2 clean-room forbids symlinks: ${path.relative(v2Root, target)}`)

      if (entry.isDirectory()) {
        stack.push(target)
        continue
      }

      if (entry.isFile()) files.push(target)
    }
  }

  return files
}

function importSpecifiers(source) {
  const values = []
  const patterns = [
    /\b(?:import|export)\s+(?:[^'";]+?\s+from\s+)?['"]([^'"]+)['"]/g,
    /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    /\brequire\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  ]

  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) values.push(match[1])
  }

  return values
}

function cssAssetSpecifiers(source) {
  const values = []
  for (const match of source.matchAll(/url\(\s*(['"]?)([^)'"\s]+)\1\s*\)/g)) {
    values.push(match[2])
  }
  return values
}

function assertRelativeReferenceInsideV2(filePath, specifier, kind) {
  if (!specifier.startsWith('.')) return
  const resolved = path.resolve(path.dirname(filePath), specifier)
  assert(
    insideV2(resolved),
    `${kind} escapes V2 clean-room in ${path.relative(v2Root, filePath)}: ${specifier}`,
  )
}

function assertNoLegacyLiteral(filePath, source) {
  const normalized = source.replaceAll('\\', '/')
  for (const legacyRoot of legacyRoots) {
    const patterns = [
      `../${legacyRoot}/`,
      `../../${legacyRoot}/`,
      `/${legacyRoot}/`,
      `${repoRoot.replaceAll('\\', '/')}/${legacyRoot}/`,
    ]
    for (const pattern of patterns) {
      assert(
        !normalized.includes(pattern),
        `legacy path reference detected in ${path.relative(v2Root, filePath)}: ${pattern}`,
      )
    }
  }
}

async function verifySourceBoundary() {
  const files = (await Promise.all(scanRoots.map((root) => walk(root)))).flat()
  let scannedTextFiles = 0
  let checkedReferences = 0

  for (const filePath of files) {
    const extension = path.extname(filePath).toLowerCase()
    if (!textExtensions.has(extension)) continue

    const source = await readFile(filePath, 'utf8')
    scannedTextFiles += 1
    assertNoLegacyLiteral(filePath, source)

    for (const specifier of importSpecifiers(source)) {
      checkedReferences += 1
      assertRelativeReferenceInsideV2(filePath, specifier, 'module reference')
    }

    if (extension === '.css' || extension === '.scss') {
      for (const specifier of cssAssetSpecifiers(source)) {
        if (/^(?:data:|https?:|#)/i.test(specifier)) continue
        checkedReferences += 1
        assertRelativeReferenceInsideV2(filePath, specifier, 'stylesheet asset reference')
      }
    }
  }

  return { scannedTextFiles, checkedReferences }
}

async function verifyDirectDependencyLicenses() {
  const packageJson = JSON.parse(await readFile(path.join(v2Root, 'package.json'), 'utf8'))
  const directDependencies = {
    ...(packageJson.dependencies ?? {}),
    ...(packageJson.devDependencies ?? {}),
  }
  const licenses = []

  for (const dependency of Object.keys(directDependencies).sort()) {
    const packagePath = path.join(v2Root, 'node_modules', ...dependency.split('/'), 'package.json')
    const installed = JSON.parse(await readFile(packagePath, 'utf8'))
    const license = typeof installed.license === 'string' ? installed.license.trim() : ''

    assert(license, `direct dependency ${dependency} has no machine-readable license field`)
    assert(!/^UNLICENSED$/i.test(license), `direct dependency ${dependency} is marked UNLICENSED`)
    assert(!/^SEE LICENSE IN\b/i.test(license), `direct dependency ${dependency} requires manual license-file review: ${license}`)

    licenses.push({ dependency, version: installed.version ?? 'unknown', license })
  }

  return licenses
}

const canonicalV2RealPath = await realpath(v2Root)
assert(canonicalV2RealPath === v2Root, 'V2 root itself must not resolve through a symlink')

const sourceBoundary = await verifySourceBoundary()
const dependencyLicenses = await verifyDirectDependencyLicenses()

console.log(JSON.stringify({
  status: 'clean_room_source_boundary_verified',
  v2_root: path.relative(repoRoot, v2Root),
  legacy_roots: legacyRoots,
  source_boundary: sourceBoundary,
  direct_dependency_licenses: dependencyLicenses,
  limitation: 'This check prevents runtime/source coupling to legacy paths and missing direct dependency license metadata; it does not prove authorship or reuse rights for copied content.',
}, null, 2))
