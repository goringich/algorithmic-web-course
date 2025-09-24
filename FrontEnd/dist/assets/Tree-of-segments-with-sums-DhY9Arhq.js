const e="Дерево отрезков с суммами",n=[`        Дерево отрезков с суммами — это структура данных, преднзначенная для эффективных вычислений сумм на подотрезках массива. Она позволяет быстро (за логарифмическое время) вычислять сумму элементов на отрезке и обновлять элементы массива.

         Дерево отрезков - структура данных, позволяющая выполнять многие операции с отрезками массива за O(logN). Дерево отрезков - универсальная структура данных, для которой можно реализовать неограниченный набор операций (иногда за большую сложность: O(log2N)).`,`__Для чего нужен этот алгоритм?__
        К примеру, представьте, что надо найти сумму последовательности чисел, при этом нам нужно не просто вычислить сумму чисел указанной последовательности (сумму элементов определённого массива), а максимально быстро найти сумму любой последовательности из этих чисел. То есть мы можем задать какой-нибудь интервал (отрезок) и максимально быстро дать ответ, чему равна сумма чисел из этого интервала.

        Что значит быстро? Это значит быстрее, чем, если бы мы просто суммировали числа. Ведь чисел может быть и миллионы, и миллиарды…
        Именно желание быстро находить сумму последовательных элементов и стало мотивацией для создания данного алгоритма. Причём, речь идёт не только о сумме, но и о других задачах, например, вычислении любой ассоциативной функции. Таким образом, мы говорим об операциях, выполнение которых не зависит от порядка вычисления.`,`__Построение дерева отрезков__
        Дерево отрезков - полное бинарное дерево, в котором каждая вершина отвечает за некоторый отрезок в массиве. Корень дерева отвечает за весь массив, его две дочерних вершины - за две половины, и так далее. У каждой вершины, отвечающей за отрезок длиной больше 1, есть две дочерних вершины, отвечающих за левую и правую половины этого отрезка. Листья дерева отрезков отвечают за отдельные элементы (отрезки длиной 1).

        Для массива из n элементов дерево отрезков имеет около 2n вершин (n+n/2+n/4+…), а его высота равна порядка logn.

        Главное свойство дерева отрезков, на котором и строятся все алгоритмы работы с ним: любой непрерывный отрезок в массиве из n элементов можно представить с помощью около 2logn вершин в дереве отрезков.`,`**Несколько важных замечаний!!!**
    • Нумеровать этот массив удобно с единицы. Таким образом легко вычислять номер детей и родителей. Формула вычисления «левого ребёнка»: i*2, «правого»: i*2+1.
    • Чтобы от "ребенка" подняться к "родителю", используем целочисленное деление i / 2.
    • У левых детей чётные номера, у правых — нечётные.`,`__Описание алгоритма__
        Мы знаем, что во всех вершинах лежат корректные значения. Тогда мы можем создать рекурсивную функцию, рассмотрев три случая:
    • Если отрезок вершины лежит целиком в отрезке запроса, то вернуть записанную в ней сумму.
    • Если отрезки вершины и запроса не пересекаются, то вернуть 0.
    • Иначе разделиться рекурсивно на 2 и вернуть сумму этой функции от обоих детей.

        Чтобы разобраться, почему это работает за O(logn), нужно оценить количество «интересных» отрезков — тех, которые порождают новые вызовы рекурсии. Это будут только те, которые содержат границу запросов — остальные сразу завершатся. Обе границы отрезка содержатся в O(logn) отрезках, а значит и итоговая асимптотика будет такая же.`],t=`#include <bits/stdc++.h>
using namespace std;

int len_mass, left_limit, right_limit;
int mass[1000];         // Input array
int tree[100000];       // Segment tree (stores sums)

// Build segment tree from array
void build_tree(int node, int left_element, int right_element) {
    if (left_element == right_element) {
        tree[node] = mass[left_element];
    } 
    else {
        int middle_element = (left_element + right_element) / 2;
        build_tree(node*2, left_element, middle_element);
        build_tree(node*2+1, middle_element+1, right_element);
        tree[node] = tree[node*2] + tree[node*2+1];
    }
}

// Query sum in [left_limit, right_limit] range
int get_sum(int left_limit, int right_limit, int node, int left_element, int right_element) {
    if (left_limit <= left_element && right_element <= right_limit) {
        return tree[node];
    }
    if (right_element < left_limit || right_limit < left_element) {
        return 0;
    }
    int middle_element = (left_element + right_element) / 2;
    return get_sum(left_limit, right_limit, node*2, left_element, middle_element) + 
           get_sum(left_limit, right_limit, node*2+1, middle_element+1, right_element);
}

// Update value at index
void update(int index, int value, int node, int left_element, int right_element) {
    if (left_element == right_element) {
        mass[index] = value;
        tree[node] = value;
        return;
    }
    if (index < left_element || right_element < index) {
        return;
    }
    int middle_element = (left_element + right_element) / 2;
    update(index, value, node*2, left_element, middle_element);
    update(index, value, node*2+1, middle_element + 1, right_element);
    tree[node] = tree[node*2] + tree[node*2+1];
}

int main() {
    cin >> len_mass;
    for (int i = 0 ; i < len_mass; i++) {
        cin >> mass[i];
    }
    cin >> left_limit >> right_limit;
    build_tree(1, 0, len_mass-1);    // Root node covers entire array [0, n-1]
    cout << get_sum(left_limit, right_limit, 1, 0, len_mass-1);
}`,i="Визуализация дерева отрезков.",l={title:e,content:n,code:t,visualization:i};export{t as code,n as content,l as default,e as title,i as visualization};
//# sourceMappingURL=Tree-of-segments-with-sums-DhY9Arhq.js.map
