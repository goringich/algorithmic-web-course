import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Zap, 
  Plus, 
  Search, 
  RefreshCw, 
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

// Optimized BIT implementation
const createBIT = (arr) => {
  const n = arr.length;
  const bit = new Array(n + 1).fill(0);
  
  const update = (i, val) => {
    const originalI = i;
    const path = [];
    while (i <= n) {
      path.push(i);
      bit[i] += val;
      i += i & -i; // Add least significant bit
    }
    return { path, node: originalI };
  };
  
  const sum = (i) => {
    let result = 0;
    const path = [];
    while (i > 0) {
      path.push(i);
      result += bit[i];
      i -= i & -i; // Remove least significant bit
    }
    return { sum: result, path };
  };
  
  const rangeSum = (l, r) => {
    const rightQuery = sum(r);
    const leftQuery = l > 1 ? sum(l - 1) : { sum: 0, path: [] };
    return { 
      sum: rightQuery.sum - leftQuery.sum, 
      rightPath: rightQuery.path,
      leftPath: leftQuery.path
    };
  };
  
  // Initialize BIT
  for (let i = 0; i < n; i++) {
    update(i + 1, arr[i]);
  }
  
  return { bit, update, sum, rangeSum };
};

// Utility to calculate node positions based on BIT structure
const calculateNodePositions = (size) => {
  const positions = {};
  const levels = Math.floor(Math.log2(size)) + 1;
  
  for (let level = 0; level < levels; level++) {
    const intervalSize = Math.pow(2, level);
    positions[intervalSize] = { nodesAtLevel: 0, totalNodes: Math.floor(size / intervalSize) };
    
    for (let i = intervalSize; i <= size; i += intervalSize * 2) {
      positions[i] = {
        level,
        intervalSize,
        indexInLevel: positions[intervalSize].nodesAtLevel++,
        totalInLevel: Math.ceil(size / (intervalSize * 2))
      };
    }
  }
  
  return positions;
};

// Binary representation of a number
const getBinaryRepresentation = (num, bits) => {
  return num.toString(2).padStart(bits, '0');
};

// Component for displaying the binary representation
const BinaryView = ({ num, bits, highlightedBit }) => {
  const binary = getBinaryRepresentation(num, bits);
  
  return (
    <div className="flex justify-center mb-1 text-xs font-mono">
      {binary.split('').map((bit, idx) => (
        <span 
          key={idx}
          className={`w-4 inline-block text-center ${
            idx === highlightedBit ? 'bg-yellow-200 font-bold' : ''
          }`}
        >
          {bit}
        </span>
      ))}
    </div>
  );
};

// Connection lines between nodes
const NodeConnections = ({ nodePositions, size, bit, highlightedPath }) => {
  const connections = [];
  const bits = Math.floor(Math.log2(size)) + 1;
  
  // Generate SVG paths for connections
  Object.entries(nodePositions).forEach(([nodeIdx, pos]) => {
    const idx = parseInt(nodeIdx);
    let childIdx = idx + (idx & -idx);
    
    if (childIdx <= size && nodePositions[childIdx]) {
      const startX = pos.x;
      const startY = pos.y + 30;
      const endX = nodePositions[childIdx].x;
      const endY = nodePositions[childIdx].y;
      
      const isHighlighted = highlightedPath && 
        highlightedPath.includes(idx) && 
        highlightedPath.includes(childIdx);
      
      connections.push(
        <motion.path
          key={`line-${idx}-${childIdx}`}
          d={`M ${startX} ${startY} C ${startX} ${(startY + endY) / 2}, ${endX} ${(startY + endY) / 2}, ${endX} ${endY}`}
          stroke={isHighlighted ? "#ff6b6b" : "#ccc"}
          strokeWidth={isHighlighted ? 2 : 1}
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: 1,
            stroke: isHighlighted ? "#ff6b6b" : "#ccc",
            strokeWidth: isHighlighted ? 2 : 1
          }}
          transition={{ duration: 1, delay: 0.3 }}
        />
      );
    }
  });
  
  return (
    <svg className="absolute w-full h-full top-0 left-0 pointer-events-none">
      {connections}
    </svg>
  );
};

// A single tree node
const TreeNode = ({ value, intervalSize, position, highlighted, updateAnimation, animatingIn }) => {
  const nodeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } },
    update: { scale: [1, 1.2, 1], backgroundColor: ['#ffffff', '#90ee90', '#ffffff'], transition: { duration: 0.5 } }
  };
  
  return (
    <motion.div
      className={`absolute flex flex-col items-center`}
      style={{ left: position.x, top: position.y }}
      initial="hidden"
      animate={updateAnimation ? "update" : "visible"}
      variants={nodeVariants}
    >
      <div className="text-xs text-gray-600 mb-1">{intervalSize}</div>
      <motion.div
        className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 ${
          highlighted ? 'border-red-500 bg-red-100' : 'border-red-400'
        } shadow-md font-bold text-lg`}
        whileHover={{ scale: 1.05 }}
      >
        {value}
      </motion.div>
    </motion.div>
  );
};

// Array visualization at the bottom
const ArrayVisualization = ({ array, activeIndices }) => {
  return (
    <div className="flex justify-center space-x-2 mt-8">
      {array.map((value, idx) => (
        <motion.div
          key={`array-${idx}`}
          className={`flex flex-col items-center`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1, duration: 0.3 }}
        >
          <motion.div
            className={`w-10 h-10 flex items-center justify-center border ${
              activeIndices.includes(idx + 1) ? 'border-red-500 bg-red-100' : 'border-gray-300'
            } rounded`}
            whileHover={{ scale: 1.1 }}
          >
            {value}
          </motion.div>
          <div className="text-xs text-gray-600 mt-1">{idx + 1}</div>
        </motion.div>
      ))}
    </div>
  );
};

// Operation log for visualizing steps
const OperationLog = ({ logs }) => {
  const logRef = useRef(null);
  
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);
  
  if (logs.length === 0) return null;
  
  return (
    <motion.div 
      className="mt-4 border border-gray-200 rounded-lg p-2 bg-gray-50 h-24 overflow-y-auto"
      ref={logRef}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "6rem", opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {logs.map((log, idx) => (
        <motion.div 
          key={idx} 
          className="text-sm mb-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="text-blue-500 font-mono">{`>`}</span> {log}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Main component
const FenwickTreeVisualizer = () => {
  const [array, setArray] = useState([3, 5, 7, 9, 11, 13, 15]);
  const [inputArray, setInputArray] = useState('[3,5,7,9,11,13,15]');
  const [bit, setBit] = useState(null);
  const [nodePositions, setNodePositions] = useState({});
  const [highlightedPath, setHighlightedPath] = useState([]);
  const [updateIndex, setUpdateIndex] = useState(1);
  const [updateValue, setUpdateValue] = useState(1);
  const [queryLeft, setQueryLeft] = useState(1);
  const [queryRight, setQueryRight] = useState(7);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [result, setResult] = useState(null);
  const [operationLogs, setOperationLogs] = useState([]);
  const [activeIndices, setActiveIndices] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [viewMode, setViewMode] = useState('standard'); // 'standard' or 'binary'
  const containerRef = useRef(null);
  
  const addLog = (message) => {
    setOperationLogs(prev => [...prev, message]);
  };
  
  // Calculate absolute positions based on relative positions
  const calculateAbsolutePositions = (relativePositions, containerWidth, containerHeight) => {
    const absolutePositions = {};
    const levels = Math.max(...Object.values(relativePositions).map(pos => pos.level)) + 1;
    const levelHeight = containerHeight / (levels + 1);
    
    Object.entries(relativePositions).forEach(([idx, pos]) => {
      const { level, indexInLevel, totalInLevel } = pos;
      const sectionWidth = containerWidth / (totalInLevel + 1);
      const x = (indexInLevel + 1) * sectionWidth;
      const y = (level + 1) * levelHeight;
      
      absolutePositions[idx] = {
        ...pos,
        x,
        y
      };
    });
    
    return absolutePositions;
  };
  
  // Initialize BIT when array changes
  useEffect(() => {
    const bitInstance = createBIT(array);
    setBit(bitInstance);
    
    const container = containerRef.current;
    if (container) {
      const { width, height } = container.getBoundingClientRect();
      const relPositions = calculateNodePositions(array.length);
      const absPositions = calculateAbsolutePositions(relPositions, width, height * 0.8);
      setNodePositions(absPositions);
    }
    
    addLog(`Created BIT from array [${array.join(', ')}]`);
  }, [array]);
  
  // Recalculate positions on window resize
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      if (container) {
        const { width, height } = container.getBoundingClientRect();
        const relPositions = calculateNodePositions(array.length);
        const absPositions = calculateAbsolutePositions(relPositions, width, height * 0.8);
        setNodePositions(absPositions);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [array.length]);
  
  // Handle array input change
  const handleArrayChange = (e) => {
    setInputArray(e.target.value);
  };
  
  const applyArrayChange = () => {
    try {
      let parsedArray = JSON.parse(inputArray);
      if (!Array.isArray(parsedArray)) {
        throw new Error("Not an array");
      }
      
      // Ensure we have numbers
      parsedArray = parsedArray.map(val => Number(val));
      if (parsedArray.some(isNaN)) {
        throw new Error("Array contains non-numeric values");
      }
      
      setArray(parsedArray);
      setQueryRight(parsedArray.length);
      addLog(`Updated array to [${parsedArray.join(', ')}]`);
    } catch (e) {
      addLog(`Error parsing array: ${e.message}`);
    }
  };
  
  // Update value in the tree
  const handleUpdate = async () => {
    if (!bit || isAnimating || updateIndex < 1 || updateIndex > array.length) return;
    
    setIsAnimating(true);
    setResult(null);
    
    const oldValue = array[updateIndex - 1];
    const diff = updateValue - oldValue;
    
    addLog(`Updating index ${updateIndex} from ${oldValue} to ${updateValue} (diff: ${diff > 0 ? '+' : ''}${diff})`);
    
    const { path, node } = bit.update(updateIndex, diff);
    
    // Animate the update path
    setHighlightedPath(path);
    setActiveIndices([updateIndex]);
    
    // Apply update after animation
    setTimeout(() => {
      const newArray = [...array];
      newArray[updateIndex - 1] = updateValue;
      setArray(newArray);
      
      setResult(`Updated index ${updateIndex} to ${updateValue}`);
      
      // Clear highlighting
      setTimeout(() => {
        setHighlightedPath([]);
        setActiveIndices([]);
        setIsAnimating(false);
      }, 1000 / animationSpeed);
    }, 1500 / animationSpeed);
  };
  
  // Query prefix sum
  const handlePrefixSum = () => {
    if (!bit || isAnimating) return;
    
    setIsAnimating(true);
    setResult(null);
    
    addLog(`Computing prefix sum for range [1..${queryRight}]`);
    
    const { sum: prefixSum, path } = bit.sum(queryRight);
    
    // Animate the sum path
    setHighlightedPath(path);
    setActiveIndices(Array.from({ length: queryRight }, (_, i) => i + 1));
    
    // Show result after animation
    setTimeout(() => {
      setResult(`Prefix sum for [1..${queryRight}] = ${prefixSum}`);
      
      // Clear highlighting
      setTimeout(() => {
        setHighlightedPath([]);
        setActiveIndices([]);
        setIsAnimating(false);
      }, 1000 / animationSpeed);
    }, 1500 / animationSpeed);
  };
  
  // Query range sum
  const handleRangeSum = () => {
    if (!bit || isAnimating || queryLeft < 1 || queryRight > array.length || queryLeft > queryRight) return;
    
    setIsAnimating(true);
    setResult(null);
    
    addLog(`Computing range sum for [${queryLeft}..${queryRight}]`);
    
    const { sum: rangeSum, rightPath, leftPath } = bit.rangeSum(queryLeft, queryRight);
    
    // First animate right sum path
    setHighlightedPath(rightPath);
    setActiveIndices(Array.from({ length: queryRight - queryLeft + 1 }, (_, i) => i + queryLeft));
    
    setTimeout(() => {
      // Then animate left sum path if needed
      if (leftPath.length > 0) {
        setHighlightedPath(leftPath);
        
        setTimeout(() => {
          setResult(`Range sum for [${queryLeft}..${queryRight}] = ${rangeSum}`);
          
          // Clear highlighting
          setTimeout(() => {
            setHighlightedPath([]);
            setActiveIndices([]);
            setIsAnimating(false);
          }, 1000 / animationSpeed);
        }, 1500 / animationSpeed);
      } else {
        setResult(`Range sum for [${queryLeft}..${queryRight}] = ${rangeSum}`);
        
        // Clear highlighting
        setTimeout(() => {
          setHighlightedPath([]);
          setActiveIndices([]);
          setIsAnimating(false);
        }, 1000 / animationSpeed);
      }
    }, 1500 / animationSpeed);
  };
  
  // Toggle view mode between standard and binary
  const toggleViewMode = () => {
    setViewMode(viewMode === 'standard' ? 'binary' : 'standard');
  };
  
  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto p-4 overflow-hidden">
      <motion.h1 
        className="text-3xl font-bold text-center text-gray-800 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Binary Indexed Tree Visualization
      </motion.h1>
      
      <div className="flex flex-col md:flex-row gap-4">
        {/* Control Panel */}
        <motion.div 
          className="flex-none w-full md:w-64 bg-gray-50 rounded-lg shadow-md p-4"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-lg font-semibold mb-4">Controls</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Array Input</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputArray}
                  onChange={handleArrayChange}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-blue-500 text-white rounded-md flex items-center justify-center"
                  onClick={applyArrayChange}
                >
                  <RefreshCw size={16} />
                </motion.button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Index</label>
                <input
                  type="number"
                  min={1}
                  max={array.length}
                  value={updateIndex}
                  onChange={(e) => setUpdateIndex(Math.min(array.length, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                <input
                  type="number"
                  value={updateValue}
                  onChange={(e) => setUpdateValue(parseInt(e.target.value) || 0)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2 bg-red-400 hover:bg-red-500 text-white rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              onClick={handleUpdate}
              disabled={isAnimating}
            >
              <Plus size={16} />
              Update
            </motion.button>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Left</label>
                <input
                  type="number"
                  min={1}
                  max={array.length}
                  value={queryLeft}
                  onChange={(e) => setQueryLeft(Math.min(array.length, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Right</label>
                <input
                  type="number"
                  min={1}
                  max={array.length}
                  value={queryRight}
                  onChange={(e) => setQueryRight(Math.min(array.length, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2 bg-red-400 hover:bg-red-500 text-white rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              onClick={handleRangeSum}
              disabled={isAnimating}
            >
              <Search size={16} />
              Range Sum
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2 bg-red-400 hover:bg-red-500 text-white rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              onClick={handlePrefixSum}
              disabled={isAnimating}
            >
              <ArrowRight size={16} />
              Prefix Sum
            </motion.button>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Animation Speed</label>
              <div className="px-2">
                <input
                  type="range"
                  min={0.5}
                  max={3}
                  step={0.5}
                  value={animationSpeed}
                  onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Slow</span>
                  <span>Medium</span>
                  <span>Fast</span>
                </div>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2"
              onClick={toggleViewMode}
            >
              <Zap size={16} />
              {viewMode === 'standard' ? 'Show Binary View' : 'Show Standard View'}
            </motion.button>
          </div>
          
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 p-3 bg-gray-100 border border-gray-200 rounded-md text-center"
              >
                <p className="text-sm font-medium">{result}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Visualization Area */}
        <motion.div 
          className="flex-1 relative bg-gray-50 rounded-lg shadow-md p-4 min-h-[500px]"
          ref={containerRef}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Node connections */}
          {bit && Object.keys(nodePositions).length > 0 && (
            <NodeConnections 
              nodePositions={nodePositions} 
              size={array.length} 
              bit={bit} 
              highlightedPath={highlightedPath}
            />
          )}
          
          {/* Tree nodes */}
          {bit && Object.entries(nodePositions).map(([nodeIdx, position]) => {
            const idx = parseInt(nodeIdx);
            const value = bit.bit[idx];
            const isHighlighted = highlightedPath.includes(idx);
            
            if (viewMode === 'binary') {
              const lsb = idx & -idx;
              const binaryIdx = getBinaryRepresentation(idx, Math.floor(Math.log2(array.length)) + 1);
              const lsbPosition = binaryIdx.length - Math.log2(lsb);
              
              return (
                <div
                  key={`bit-${idx}`}
                  className="absolute flex flex-col items-center"
                  style={{ left: position.x, top: position.y }}
                >
                  <div className="text-xs text-gray-600 mb-1">{position.intervalSize}</div>
                  <BinaryView 
                    num={idx} 
                    bits={Math.floor(Math.log2(array.length)) + 1} 
                    highlightedBit={Math.floor(lsbPosition)}
                  />
                  <motion.div
                    className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 ${
                      isHighlighted ? 'border-red-500 bg-red-100' : 'border-red-400'
                    } shadow-md font-bold text-lg`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24, delay: idx * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {value}
                  </motion.div>
                </div>
              );
            }
            
            return (
              <TreeNode
                key={`bit-${idx}`}
                value={value}
                intervalSize={position.intervalSize}
                position={position}
                highlighted={isHighlighted}
                updateAnimation={false}
                animatingIn={true}
              />
            );
          })}
          
          {/* Array visualization */}
          <ArrayVisualization array={array} activeIndices={activeIndices} />
          
          {/* Operation log */}
          <OperationLog logs={operationLogs} />
        </motion.div>
      </div>
      
      {/* Information panel */}
      <motion.div
        className="mt-6 bg-white rounded-lg shadow-md p-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-lg font-semibold mb-2">About Binary Indexed Tree</h2>
        <p className="text-sm text-gray-700">
          The Binary Indexed Tree (BIT) or Fenwick Tree is a data structure that efficiently supports prefix sum queries and element updates.
          Each node in the tree is responsible for a specific range of elements, with the range size determined by the least significant bit
          of the node's index. BIT provides O(log n) complexity for both updates and queries.
        </p>
      </motion.div>
    </div>
  );
};

export default FenwickTreeVisualizer;