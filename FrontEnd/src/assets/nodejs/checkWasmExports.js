import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  try {
    // Загрузка WebAssembly файла
    const wasmPath = path.resolve(__dirname, '../JS_complied_algorithms/segment_tree.wasm');
    const wasmBuffer = fs.readFileSync(wasmPath);

    const memory = new WebAssembly.Memory({ initial: 256, maximum: 512 });

    // Компиляция и инициализация WebAssembly модуля
    const wasmModule = await WebAssembly.compile(wasmBuffer);
    const wasmInstance = await WebAssembly.instantiate(wasmModule, {
      env: {
        memory, // Если ваш модуль использует память
        table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' }), // Если используется таблица
        abort: () => console.log('Abort called from WebAssembly!'), // Заглушка для функции abort
      },
    });

    // Список экспортируемых функций
    console.log('Экспортируемые функции:', Object.keys(wasmInstance.exports));
  } catch (error) {
    console.error('Ошибка при проверке WebAssembly модуля:', error);
  }
})();
