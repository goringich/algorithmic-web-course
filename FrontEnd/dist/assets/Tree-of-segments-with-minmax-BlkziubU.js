const e="Дерево отрезков с минимальными/максимальными значениями",n=[`        Дерево отрезков для минимума и максимума строится по тому же принципу, что и классическое дерево отрезков для сумм, но с ключевыми отличиями в операциях. Вместо хранения и вычисления сумм на отрезках, эта структура данных хранит минимальные и максимальные значения, что позволяет эффективно решать задачи поиска экстремумов на любом интервале исходного массива.
        Главными отличиями в функциях являются замена суммы на минимум (максимум) и изменение нейтрального элемента на +∞ (-∞).`,"        Процесс построения аналогичен дереву для сумм, но вместо суммирования значений детей используется выбор минимума(максимума). Дерево отрезков для минимума/максимума сохраняет все преимущества классической структуры - логарифмическое время запросов и обновлений, при этом решая более специализированные задачи поиска экстремальных значений. Эта модификация находит широкое применение в анализе данных и алгоритмических задачах, где требуется быстрый доступ к минимальным и максимальным значениям на произвольных интервалах."],t=`#include <bits/stdc++.h>
using namespace std;

const int MAX_N = 1000;       // Maximum array size
const int MAX_TREE = 4000;    // Tree size (4*MAX_N for safety)
int len_mass, left_limit, right_limit;
int mass[MAX_N];              // Input array
int tree[MAX_TREE];           // Segment tree storing minimum values

// Build segment tree for range minimum queries
void build_tree(int node, int left_element, int right_element) {
    // Leaf node case
    if (left_element == right_element) {
        tree[node] = mass[left_element];
        return;
    }
    // Recursively build left and right subtrees
    int mid = (left_element + right_element) / 2;
    build_tree(node*2, left_element, mid);
    build_tree(node*2+1, mid+1, right_element);
    // Store minimum of two children
    tree[node] = min(tree[node*2], tree[node*2+1]);//tree[node] = max(tree[node*2], tree[node*2+1]);
}

// Query minimum in range [L, R]
int get_min(int L, int R, int node, int node_L, int node_R) {//get_max
    // Current segment completely within query range
    if (L <= node_L && node_R <= R) 
        return tree[node];
    // Current segment completely outside query range
    if (node_R < L || R < node_L)
        return INT_MAX;  // Neutral value for min operation 
                         // or return INT_MIN;
    // Partial overlap - query both children
    int mid = (node_L + node_R) / 2;
    return min(//max
        get_min(L, R, node*2, node_L, mid),//get_max
        get_min(L, R, node*2+1, mid+1, node_R)//get_max
    );
}

// Update value at position 'index'
void update(int index, int value, int node, int node_L, int node_R) {
    // Found the leaf node to update
    if (node_L == node_R) {
        mass[index] = value;
        tree[node] = value;
        return;
    }
    // Ignore if index outside current segment
    if (index < node_L || node_R < index)
        return;
    // Recursively update the appropriate child
    int mid = (node_L + node_R) / 2;
    update(index, value, node*2, node_L, mid);
    update(index, value, node*2+1, mid+1, node_R);
    // Update current node with new minimum
    tree[node] = min(tree[node*2], tree[node*2+1]);//tree[node] = max(tree[node*2], tree[node*2+1]);
}

int main() {
    // Input array
    cin >> len_mass;
    for (int i = 0; i < len_mass; i++)
        cin >> mass[i];
    // Input query range
    cin >> left_limit >> right_limit;
    // Build segment tree
    build_tree(1, 0, len_mass-1);
    // Execute range minimum query
    cout << 'Minimum in range [' << left_limit << ', ' << right_limit << ']: ';//Maximum in range
    cout << get_min(left_limit, right_limit, 1, 0, len_mass-1) << endl;//get_max
    return 0;
}`,i="",r={title:e,content:n,code:t,visualization:i};export{t as code,n as content,r as default,e as title,i as visualization};
//# sourceMappingURL=Tree-of-segments-with-minmax-BlkziubU.js.map
