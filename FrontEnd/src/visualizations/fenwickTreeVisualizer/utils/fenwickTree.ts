export interface FenwickTree {
  bit: number[];
  update: (i: number, val: number) => number[];
  prefixSum: (i: number) => { sum: number; path: number[] };
  rangeSum: (l: number, r: number) => {
    sum: number;
    rightPath: number[];
    leftPath: number[];
  };
}

export function createFenwickTree(arr: number[]): FenwickTree {
  const n = arr.length;
  const bit = new Array(n + 1).fill(0);

  const update = (i: number, val: number) => {
    const path: number[] = [];
    while (i <= n) {
      path.push(i);
      bit[i] += val;
      i += i & -i;
    }
    return path;
  };

  const prefixSum = (i: number) => {
    let result = 0;
    const path: number[] = [];
    while (i > 0) {
      path.push(i);
      result += bit[i];
      i -= i & -i;
    }
    return { sum: result, path };
  };

  const rangeSum = (l: number, r: number) => {
    const rightQuery = prefixSum(r);
    const leftQuery = l > 1 ? prefixSum(l - 1) : { sum: 0, path: [] };
    return {
      sum: rightQuery.sum - leftQuery.sum,
      rightPath: rightQuery.path,
      leftPath: leftQuery.path
    };
  };

  for (let i = 0; i < n; i++) {
    update(i + 1, arr[i]);
  }

  return { bit, update, prefixSum, rangeSum };
}
