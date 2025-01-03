import wasmUrl from '../../assets/JS_complied_algorithms/segment_tree.wasm';

async function loadWasm() {
  const response = await fetch(wasmUrl);
  const buffer = await response.arrayBuffer();
  const wasmModule = await WebAssembly.instantiate(buffer, imports);
  console.log('WASM Module loaded:', wasmModule.instance.exports);
  return wasmModule.instance.exports;
}

loadWasm().catch(console.error);
