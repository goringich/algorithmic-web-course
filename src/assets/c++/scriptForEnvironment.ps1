# Установка переменной PATH для Emscripten
$env:PATH = "C:\emsdk;C:\emsdk\upstream\emscripten;C:\emsdk\node\20.18.0_64bit\bin;" + $env:PATH

emcc segment_tree.cpp `
  -o ../JS_complied_algorithms/segment_tree.mjs `
  --bind `
  -std=c++17 `
  -s EXPORT_ES6=1 `
  -s MODULARIZE=1 `
  -s ALLOW_MEMORY_GROWTH=1

