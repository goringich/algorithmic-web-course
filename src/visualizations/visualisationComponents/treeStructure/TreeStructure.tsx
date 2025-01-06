// src/components/TreeStructure.tsx

import React from 'react';

interface TreeStructureProps {
  parentMap: Record<string, string>;
}

const TreeStructure: React.FC<TreeStructureProps> = ({ parentMap }) => (
  <div>
    <h3>Tree Structure (parentMap)</h3>
    <pre>{JSON.stringify(parentMap, null, 2)}</pre>
  </div>
);

export default TreeStructure;
