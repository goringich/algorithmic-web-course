import React from "react";

interface TreeStructureProps {
  parentMap: Record<string, string>;
}

const TreeStructure: React.FC<TreeStructureProps> = ({ parentMap }) => {
  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Tree Structure (parentMap)</h3>
      <pre>{JSON.stringify(parentMap, null, 2)}</pre>
    </div>
  );
};

export default TreeStructure;
