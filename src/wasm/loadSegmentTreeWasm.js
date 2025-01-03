// public/wasm/loadSegmentTreeWasm.js
import createSegmentTreeModule from "../assets/JS_complied_algorithms/segment_tree";

export async function loadSegmentTreeWasm() {
  // Инициализируем модуль с необходимыми импортами
  const module = await createSegmentTreeModule({
    env: {
      memory: new WebAssembly.Memory({ initial: 256, maximum: 512 }),
      table: new WebAssembly.Table({ initial: 0, element: "anyfunc" }),
      abort: console.error,
      _embind_register_function: console.log,
      __cxa_throw: (err) => console.error("Exception:", err),
    },
    wasi_snapshot_preview1: {
      fd_close: () => {},
      fd_write: () => {},
      fd_seek: () => {},
    },
  });

  return module;
}
