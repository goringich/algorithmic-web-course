const imports = {
  env: {
    memory: new WebAssembly.Memory({ initial: 256, maximum: 512 }),
    table: new WebAssembly.Table({ initial: 0, element: "anyfunc" }),
    abort: console.error,
    _embind_register_function: console.log, // Пример для импортируемой функции
    __cxa_throw: (err: any) => console.error('Exception:', err),
  },
  wasi_snapshot_preview1: {
    fd_close: () => {},
    fd_write: () => {},
    fd_seek: () => {},
  },
};

export async function initWasm(wasmUrl: string): Promise<WebAssembly.Exports> {
  const response = await fetch(wasmUrl);
  const buffer = await response.arrayBuffer();
  const { instance } = await WebAssembly.instantiate(buffer, imports);
  console.log('WASM loaded successfully:', instance.exports);
  return instance.exports;
}
