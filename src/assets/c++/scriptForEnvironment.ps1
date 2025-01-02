# Установка переменной PATH для Emscripten
$env:PATH = "C:\emsdk;C:\emsdk\upstream\emscripten;C:\emsdk\node\20.18.0_64bit\bin;" + $env:PATH

emcc segment_tree.cpp -o ../JS_complied_algorithms/segment_tree.js --bind -std=c++17 -s WASM=1 -s MODULARIZE=1 -s EXPORT_NAME="createSegmentTreeModule" -s ALLOW_MEMORY_GROWTH=1
