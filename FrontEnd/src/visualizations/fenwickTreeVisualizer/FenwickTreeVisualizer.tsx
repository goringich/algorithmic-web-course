import React, { useState, useRef, useEffect } from "react";
import { Box, Paper, Typography } from "@mui/material";
import FenwickControls from "./components/FenwickControls";
import FenwickCanvas from "./components/FenwickCanvas/FenwickCanvas";
import FenwickInfo from "./components/FenwickInfo";
import { createFenwickTree } from "./utils/fenwickTree";

function calculateNodePositions(size) {
  const positions = {};
  const levels = Math.floor(Math.log2(size)) + 1;
  for (let level = 0; level < levels; level++) {
    const intervalSize = 2 ** level;
    let nodesAtLevel = 0;
    const totalInLevel = Math.ceil(size / (intervalSize * 2));
    for (let i = intervalSize; i <= size; i += intervalSize * 2) {
      positions[i] = {
        level,
        intervalSize,
        indexInLevel: nodesAtLevel,
        totalInLevel,
      };
      nodesAtLevel++;
    }
  }
  return positions;
}

function calculateAbsolutePositions(relativePositions, width, height) {
  const absolutePositions = {};
  const levelsArr = Object.values(relativePositions).map((p) => p.level);
  if (levelsArr.length === 0) return absolutePositions;
  const levels = Math.max(...levelsArr) + 1;
  const levelHeight = height / (levels + 1);
  for (let idx in relativePositions) {
    const pos = relativePositions[idx];
    const { level, indexInLevel, totalInLevel } = pos;
    const sectionWidth = width / (totalInLevel + 1);
    const x = (indexInLevel + 1) * sectionWidth;
    const y = (level + 1) * levelHeight;
    absolutePositions[idx] = { ...pos, x: Number(x), y: Number(y) };
  }
  return absolutePositions;
}

export default function FenwickTreeVisualizer() {
  const [array, setArray] = useState([3, 5, 7, 9, 11, 13, 15]);
  const [bit, setBit] = useState(null);
  const [nodePositions, setNodePositions] = useState({});
  const [highlightedPath, setHighlightedPath] = useState([]);
  const [updateIndex, setUpdateIndex] = useState(1);
  const [updateValue, setUpdateValue] = useState(1);
  const [queryLeft, setQueryLeft] = useState(1);
  const [queryRight, setQueryRight] = useState(array.length);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [operationLogs, setOperationLogs] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [viewMode, setViewMode] = useState("standard");
  const containerRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 });

  useEffect(() => {
    rebuildBIT();
    // eslint-disable-next-line
  }, [array]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        if (width > 0 && height > 0) {
          const adjustedHeight = height * 0.95;
          setCanvasSize({ width, height: adjustedHeight });
          updatePositions(width, adjustedHeight);
        }
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line
  }, [array.length]);

  function updatePositions(w, h) {
    if (!Number.isFinite(w) || !Number.isFinite(h)) return;
    const relPositions = calculateNodePositions(array.length);
    const absPositions = calculateAbsolutePositions(relPositions, w, h);
    // Проверка, что все координаты валидны
    for (let key in absPositions) {
      if (
        !Number.isFinite(absPositions[key].x) ||
        !Number.isFinite(absPositions[key].y)
      ) {
        console.error(
          `Неверное значение координаты для ключа ${key}`,
          absPositions[key]
        );
        return;
      }
    }
    setNodePositions(absPositions);
  }

  function rebuildBIT() {
    const fenw = createFenwickTree(array);
    setBit(fenw);
    addLog(`Создан BIT из массива [${array.join(", ")}]`);
  }

  function addLog(msg) {
    setOperationLogs((prev) => [...prev, msg]);
  }

  function onArrayChange(val) {
    // просто устанавливаем локальное значение, применяем позже
  }

  function onApplyArray() {
    try {
      const parsed = JSON.parse(
        document.querySelector('input[label="Array Input (Ввод массива)"]')
          .value
      );
      if (!Array.isArray(parsed)) throw new Error("Не массив");
      const newArr = parsed.map(Number);
      if (newArr.some(isNaN)) throw new Error("Содержит нечисловые значения");
      setArray(newArr);
      setQueryRight(newArr.length);
      addLog(`Массив обновлён: [${newArr.join(", ")}]`);
    } catch (e) {
      addLog(`Ошибка: ${e.message}`);
    }
  }

  function handleUpdate() {
    if (!bit || isAnimating) return;
    if (updateIndex < 1 || updateIndex > array.length) return;
    setIsAnimating(true);
    const oldVal = array[updateIndex - 1];
    const diff = updateValue - oldVal;
    addLog(
      `Обновление индекса ${updateIndex} с ${oldVal} до ${updateValue} (diff: ${
        diff >= 0 ? "+" : ""
      }${diff})`
    );
    const path = bit.update(updateIndex, diff);
    setHighlightedPath(path);
    setTimeout(() => {
      const newArr = [...array];
      newArr[updateIndex - 1] = updateValue;
      setArray(newArr);
      setTimeout(() => {
        setHighlightedPath([]);
        setIsAnimating(false);
      }, 1000 / animationSpeed);
    }, 1500 / animationSpeed);
  }

  function handleRangeSum() {
    if (!bit || isAnimating) return;
    if (queryLeft < 1 || queryRight > array.length || queryLeft > queryRight)
      return;
    setIsAnimating(true);
    addLog(`Диапазонная сумма [${queryLeft}..${queryRight}]`);
    const { sum, rightPath, leftPath } = bit.rangeSum(queryLeft, queryRight);
    setHighlightedPath(rightPath);
    setTimeout(() => {
      if (leftPath.length > 0) {
        setHighlightedPath(leftPath);
        setTimeout(() => {
          addLog(`Сумма: ${sum}`);
          setHighlightedPath([]);
          setIsAnimating(false);
        }, 1000 / animationSpeed);
      } else {
        addLog(`Сумма: ${sum}`);
        setTimeout(() => {
          setHighlightedPath([]);
          setIsAnimating(false);
        }, 1000 / animationSpeed);
      }
    }, 1500 / animationSpeed);
  }


  function handlePrefixSum() {
    if (!bit || isAnimating) return;
    if (queryRight < 1 || queryRight > array.length) return;
    setIsAnimating(true);
    addLog(`Префиксная сумма [1..${queryRight}]`);
    const { sum, path } = bit.prefixSum(queryRight);
    setHighlightedPath(path);
    setTimeout(() => {
      addLog(`Сумма: ${sum}`);
      setTimeout(() => {
        setHighlightedPath([]);
        setIsAnimating(false);
      }, 1000 / animationSpeed);
    }, 1500 / animationSpeed);
  }


  function toggleViewMode() {
    setViewMode(viewMode === "standard" ? "binary" : "standard");
  }

  return (
    <Box>
      <Typography variant="h4" align="center" sx={{ mb: 2 }}>
        Fenwick Tree Visualizer
      </Typography>
      <Box display="flex" gap={2}>
        <Box flex={1} maxWidth={350}>
          <FenwickControls
            array={array}
            onArrayChange={onArrayChange}
            onApplyArray={onApplyArray}
            onUpdate={handleUpdate}
            onRangeSum={handleRangeSum}
            onPrefixSum={handlePrefixSum}
            updateIndex={updateIndex}
            setUpdateIndex={setUpdateIndex}
            updateValue={updateValue}
            setUpdateValue={setUpdateValue}
            queryLeft={queryLeft}
            setQueryLeft={setQueryLeft}
            queryRight={queryRight}
            setQueryRight={setQueryRight}
            animationSpeed={animationSpeed}
            setAnimationSpeed={setAnimationSpeed}
            isAnimating={isAnimating}
            toggleViewMode={toggleViewMode}
            viewMode={viewMode}
          />

          <Paper sx={{ p: 2, mt: 2, maxHeight: 200, overflowY: "auto" }}>
            <Typography variant="subtitle1" gutterBottom>
              Журнал операций
            </Typography>
            {operationLogs.map((log, i) => (
              <Typography variant="body2" key={i}>
                {`> ${log}`}
              </Typography>
            ))}
          </Paper>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Массив
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {array.map((val, idx) => {
                const isActive = highlightedPath.includes(idx + 1);
                return (
                  <Paper
                    key={idx}
                    sx={{
                      p: 1,
                      textAlign: "center",
                      backgroundColor: isActive ? "#ffcdd2" : "#f5f5f5",
                      width: 40,
                    }}
                  >
                    <Typography variant="body1">{val}</Typography>
                    <Typography variant="caption">{idx + 1}</Typography>
                  </Paper>
                );
              })}
            </Box>
          </Box>
        </Box>

        <Paper
          ref={containerRef}
          sx={{ flex: 2, minHeight: 500, position: "relative" }}
        >
          {bit &&
            Number.isFinite(canvasSize.width) &&
            Number.isFinite(canvasSize.height) && (
              <FenwickCanvas
                canvasWidth={canvasSize.width}
                canvasHeight={canvasSize.height}
                isBinaryView={viewMode === "binary"}
              />
            )}
        </Paper>
      </Box>

      <FenwickInfo />
    </Box>
  );
}
