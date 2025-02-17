import { VisNode } from "../../../types/VisNode";

type HandleNodeClickParams = {
  node: VisNode;
  setSelectedNode: React.Dispatch<React.SetStateAction<VisNode | null>>;
  setDelta: React.Dispatch<React.SetStateAction<number>>;
};

export const handleNodeClick = ({
  node, 
  setSelectedNode, 
  setDelta 
}: HandleNodeClickParams) => {
  if (node.range[0] === node.range[1]) {
    setSelectedNode(node);
    setDelta(node.value);
  }
};

type HandleCloseSnackbarParams = {
  setSnackbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const handleCloseSnackbar = ({
  setSnackbarOpen
}: HandleCloseSnackbarParams) => {
  setSnackbarOpen(false);
};
