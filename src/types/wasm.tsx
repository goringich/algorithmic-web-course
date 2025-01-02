import wasmUrl from '../../assets/JS_complied_algorithms/segment_tree.wasm';

async function initWasm() {
  const response = await fetch(wasmUrl);
  const buffer = await response.arrayBuffer();
  const wasmModule = await WebAssembly.instantiate(buffer, {
    env: {
      // Реализуйте все необходимые функции окружения здесь
      memory: new WebAssembly.Memory({ initial: 256 }),
      abort: () => console.error('Abort called'),
      _embind_register_function: () => {},
    },
    wasi_snapshot_preview1: {}, // Пустое пространство имен, если требуется
  });
  return wasmModule.instance.exports;
}

initWasm().then(exports => {
  console.log('WASM loaded:', exports);
});
