#include <vector>
#include <emscripten/bind.h>

std::vector<int> customArray;
std::vector<int> tree;

// Построение дерева отрезков
void buildTree(int node, int start, int end) {
    if (start == end) {
        tree[node] = customArray[start];
    } else {
        int mid = (start + end) / 2;
        int leftChild = 2 * node + 1;
        int rightChild = 2 * node + 2;

        buildTree(leftChild, start, mid);
        buildTree(rightChild, mid + 1, end);

        tree[node] = tree[leftChild] + tree[rightChild];
    }
}

// Обновление элемента
void updateTree(int node, int start, int end, int index, int value) {
    if (start == end) {
        tree[node] += value;
        customArray[index] += value;
    } else {
        int mid = (start + end) / 2;
        int leftChild = 2 * node + 1;
        int rightChild = 2 * node + 2;

        if (index <= mid) {
            updateTree(leftChild, start, mid, index, value);
        } else {
            updateTree(rightChild, mid + 1, end, index, value);
        }

        tree[node] = tree[leftChild] + tree[rightChild];
    }
}

// Запрос суммы диапазона
int queryTree(int node, int start, int end, int l, int r) {
    if (r < start || l > end) {
        return 0; // Диапазоны не пересекаются
    }
    if (l <= start && end <= r) {
        return tree[node]; // Полное покрытие диапазона
    }

    int mid = (start + end) / 2;
    int leftChild = 2 * node + 1;
    int rightChild = 2 * node + 2;

    return queryTree(leftChild, start, mid, l, r) +
           queryTree(rightChild, mid + 1, end, l, r);
}

// Новые функции вместо лямбд
void setArray(const std::vector<int>& arr) {
    customArray = arr;
    tree.assign(4 * arr.size(), 0); // Initialize tree with zeros
    buildTree(0, 0, arr.size() - 1);
}

std::vector<int> getTree() {
    return tree;
}

// Связываем функции с JavaScript
EMSCRIPTEN_BINDINGS(segment_tree_module) {
    emscripten::function("buildTree", &buildTree);
    emscripten::function("updateTree", &updateTree);
    emscripten::function("queryTree", &queryTree);
    emscripten::function("setArray", &setArray);
    emscripten::function("getTree", &getTree);
}
