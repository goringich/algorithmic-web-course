declare module 'segment_tree.js' {
  type SegmentTreeModule = {
    setArray: (arr: number[]) => void;
    buildTree: (node: number, start: number, end: number) => void;
    updateTree: (node: number, start: number, end: number, index: number, value: number) => void;
    queryTree: (node: number, start: number, end: number, l: number, r: number) => number;
    getTree: () => number[];
  };

  const createSegmentTreeModule: () => Promise<SegmentTreeModule>;
  export default createSegmentTreeModule;
}
