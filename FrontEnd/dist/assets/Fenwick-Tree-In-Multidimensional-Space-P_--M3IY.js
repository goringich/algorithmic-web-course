const n="Дерево Фенвика в многомерном пространстве",i=["       Дерево Фенвика или двоичное индексированное дерево – это структура данных, используемая для вычисления запросов по диапазону или интервалу в массиве за логарифмическое время. Дерево Фенвика может быть обобщено для нескольких измерений, поэтому его знание является необходимым условием для рассмотрения многомерного случая.",`__Определение__
        Рассмотрим для двумерного случая, рассуждения для больших размерностей аналогичны. Пусть дан массив a из n*m элементов. Деревом Фенвика будем называть массив T из n*m элементов:
 $$T_{i,j} = \\sum_{k=F(i)}^{i} \\sum_{q=F(j)}^{j} a_{k,q}$,
 где F(i) = i & (i + 1), как и в одномерном случае.`,`__Основная идея__
        Наиболее распространенной реализацией алгоритма является сумма всех элементов подматрицы. Поэтому рассмотрим решение простейшей задачи этим методом.

        Рассмотрим двумерную матрицу, в которой мы хотим найти сумму подматрицы, ограниченной координатами (x1, x2) и (y1, y2). Без сложных математических вычислений мы понимаем, что она выглядит, как:

sum((x1, y1), (x2, y2)) = sum((0, 0), (x2, y2)) - sum((0, 0), (x1-1, y2)) - sum((0, 0), (x2, y1-1)) + sum((0, 0), (x1-1, y1-1))

        Уже по этой формуле видно, что она следует из принципа включения-исключения комбинаторики и именно этот принцип помогает нам обобщить этот алгоритм на большие размерности.`,`__Запрос суммы__
        ^^Используем формулу включения-исключения.^^
__Запрос обновления__
        При изменение ячейки aᵢⱼ мы обновляем все ячейки, в которых она задействована.`],t=`#include <vector>
#include <iostream>
using namespace std;
const int MAX_N = 100;  // Maximum matrix dimension
vector<vector<int>> F(MAX_N, vector<int>(MAX_N, 0));  // 2D Fenwick Tree (1-based indexing)
void update(int x, int y, int X) {//Updates the value at position (x,y) by adding X
    for (int i = x; i < MAX_N; i += i & -i) {  // Move to parent rows
        for (int j = y; j < MAX_N; j += j & -j) {  // Move to parent columns
            F[i][j] += X;
        }
    }
}
int prefixSum(int x, int y) {//Calculates prefix sum from (1,1) to (x,y)
    int res = 0;
    for (int i = x; i > 0; i -= i & -i) {  // Move to previous rows
        for (int j = y; j > 0; j -= j & -j) {  // Move to previous columns
            res += F[i][j];
        }
    }
    return res;
}
int rangeSum(int x1, int y1, int x2, int y2) {//Calculates sum of elements in rectangle from (x1,y1) to (x2,y2)
    return prefixSum(x2, y2) - prefixSum(x1-1, y2) - prefixSum(x2, y1-1) + prefixSum(x1-1, y1-1);
}
int main() {
    // Initialize array 
    vector<vector<int>> matrix = {
        {0, 0, 0, 0, 0},
        {0, 1, 2, 3, 4},
        {0, 5, 6, 7, 8},
        {0, 9, 10, 11, 12},
        {0, 13, 14, 15, 16}
    };
    int n = 4;
    // Build Fenwick tree
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++) {
            update(i, j, matrix[i][j]);
        }
    }
    // Test queries
    cout << 'Sum [(1,1)..(2,2)]: ' << rangeSum(1, 1, 2, 2) << '\\n';  // 1+2+5+6 = 14
    cout << 'Sum [(2,2)..(4,4)]: ' << rangeSum(2, 2, 4, 4) << '\\n';  // 6+7+8+10+11+12+14+15+16 = 99
    // update element (3,3)  20
    update(3, 3, 20 - matrix[3][3]);
    matrix[3][3] = 20;
    // Test quaries after updating
    cout << 'Sum [(1,1)..(3,3)]: ' << rangeSum(1, 1, 3, 3) << '\\n';  // 1+2+3+5+6+7+9+10+20 = 63 
    cout << 'Sum [(2,2)..(4,4)]: ' << rangeSum(2, 2, 4, 4) << '\\n';  // 6+7+8+10+20+12+14+15+16 = 109 
    return 0;
}`,e="",r={title:n,content:i,code:t,visualization:e};export{t as code,i as content,r as default,n as title,e as visualization};
//# sourceMappingURL=Fenwick-Tree-In-Multidimensional-Space-P_--M3IY.js.map
