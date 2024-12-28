import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Circle, Text, Line } from "react-konva";
import { TextField, Button, Box, Typography, Snackbar, Alert } from "@mui/material";
import Konva from "konva";
import { SegmentTree } from "../assets/JS_complied_algorithms/SegmentTree";

// Максимальное количество листьев
const MAX_LEAVES = 16;

const SegmentTreeVisualizer = () => {
  // Ссылка на контейнер
  const containerRef = useRef(null);

  // Ссылки на фигуры (Circle) для анимаций перемещения и т.д.
  const shapeRefs = useRef({});

  // Состояния
  const [data, setData] = useState([5, 8, 6, 3, 2, 7, 2, 6]);
  const [segmentTree, setSegmentTree] = useState(new SegmentTree(data));
  const [nodes, setNodes] = useState(segmentTree.getTreeForVisualization());

  // parentMap: для подсветки пути снизу-вверх без изменения SegmentTree
  const [parentMap, setParentMap] = useState({});
  
  // Выбранный узел (лист)
  const [selectedNode, setSelectedNode] = useState(null);
  // Дельта изменения
  const [delta, setDelta] = useState(0);
  // Ввод нового значения
  const [newValue, setNewValue] = useState("");

  // Размер Stage (ширина — адаптивная, высота — большая, чтобы можно было скроллить)
  const [stageSize, setStageSize] = useState({ width: 800, height: 1200 });

  // Состояния для Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Состояния для «модального» окна редактирования (делаем его draggable)
  const [editBoxPos, setEditBoxPos] = useState({ x: 400, y: 300 }); // начальные координаты
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // --------------------------------------------------------------------------------------------
  // useEffect: подстраиваем ширину Stage под контейнер
  // (но высоту теперь явно задаём большой, чтобы не было ограничений)
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth } = containerRef.current;
        // Высота пусть будет большая (1200), убирать или менять по желанию
        setStageSize({ width: clientWidth, height: 1200 });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --------------------------------------------------------------------------------------------
  // Функция для сборки parentMap: "childId -> parentId"
  const buildParentMap = (newNodes) => {
    const map = {};
    for (const node of newNodes) {
      for (const childId of node.children) {
        map[childId] = node.id;
      }
    }
    return map;
  };

  // --------------------------------------------------------------------------------------------
  // Анимации
  // 1) перемещение (x,y)
  const animateNodeMove = (nodeId, newX, newY) => {
    const shape = shapeRefs.current[nodeId];
    if (!shape) return;
    new Konva.Tween({
      node: shape,
      duration: 0.5,
      x: newX,
      y: newY,
      easing: Konva.Easings.EaseInOut
    }).play();
  };

  // 2) появление: scale от 0 до 1, + «сверху» (если хотим)
  const animateNodeAppear = (nodeId, finalX, finalY) => {
    const shape = shapeRefs.current[nodeId];
    if (!shape) return;

    // Начальные позиции
    shape.scale({ x: 0, y: 0 });
    shape.y(finalY - 50); // немного выше
    new Konva.Tween({
      node: shape,
      duration: 0.5,
      scaleX: 1,
      scaleY: 1,
      y: finalY, // плавно опускаем на место
      easing: Konva.Easings.EaseOut
    }).play();
  };

  // 3) исчезновение: scale до 0 (можно «вверх» унести)
  const animateNodeDisappear = (nodeId, callback) => {
    const shape = shapeRefs.current[nodeId];
    if (!shape) {
      if (callback) callback();
      return;
    }
    new Konva.Tween({
      node: shape,
      duration: 0.5,
      scaleX: 0,
      scaleY: 0,
      easing: Konva.Easings.EaseIn,
      onFinish: () => {
        if (callback) callback();
      }
    }).play();
  };

  // --------------------------------------------------------------------------------------------
  // Обновляем nodes (визуализацию) после изменения сегментного дерева
  const refreshNodes = (updatedTree) => {
    const newVisNodes = updatedTree.getTreeForVisualization();

    // 1) Анимация исчезновения для узлов, которых нет в newVisNodes
    setNodes((prev) => {
      const removed = prev.filter((oldNode) => !newVisNodes.some(n => n.id === oldNode.id));
      removed.forEach((rn) => {
        animateNodeDisappear(rn.id);
      });
      return prev;
    });

    // 2) Обновляем state "nodes" и анимируем перемещение / появление
    setNodes((prevNodes) => {
      newVisNodes.forEach((newN) => {
        const oldNode = prevNodes.find((p) => p.id === newN.id);
        if (oldNode) {
          // узел уже существовал
          if (oldNode.x !== newN.x || oldNode.y !== newN.y) {
            animateNodeMove(newN.id, newN.x, newN.y);
          }
        } else {
          // узел новый: анимируем появление
          // в момент добавления уже заданы newN.x, newN.y
          // вызываем animateNodeAppear
          setTimeout(() => {
            animateNodeAppear(newN.id, newN.x, newN.y);
          }, 50);
        }
      });
      return newVisNodes;
    });

    // 3) Обновляем parentMap
    const map = buildParentMap(newVisNodes);
    setParentMap(map);
  };

  // --------------------------------------------------------------------------------------------
  // Пересоздание сегментного дерева из новых данных
  const updateTreeWithNewData = (newData) => {
    const newST = new SegmentTree(newData);
    setSegmentTree(newST);
    refreshNodes(newST);
  };

  // --------------------------------------------------------------------------------------------
  // Добавление нового элемента
  const handleAddElement = () => {
    if (newValue === "") return;
    const value = parseInt(newValue, 10);
    if (isNaN(value)) return;

    if (data.length >= MAX_LEAVES) {
      alert("Превышен лимит (16) листьев.");
      setNewValue("");
      return;
    }
    const updatedData = [...data, value];
    setData(updatedData);
    updateTreeWithNewData(updatedData);
    setNewValue("");
  };

  // --------------------------------------------------------------------------------------------
  // Подсветка пути от данного узла (leaf) к корню, используя parentMap
  const highlightPathFromLeaf = (leafNodeId) => {
    let currentId = leafNodeId;
    let prevId = null;

    // Снимаем старые подсветки
    setNodes((old) => old.map((n) => ({ ...n, isHighlighted: false })));

    const pathIds = [];
    while (currentId) {
      pathIds.push(currentId);
      const pId = parentMap[currentId];
      if (!pId || pId === currentId) break;
      currentId = pId;
    }

    let i = 0;
    const interval = setInterval(() => {
      if (prevId != null) {
        // Снимаем подсветку с предыдущего
        setNodes((old) =>
          old.map((node) =>
            node.id === prevId ? { ...node, isHighlighted: false } : node
          )
        );
      }
      if (i < pathIds.length) {
        const currentHighlightId = pathIds[i];
        setNodes((old) =>
          old.map((node) =>
            node.id === currentHighlightId ? { ...node, isHighlighted: true } : node
          )
        );
        prevId = currentHighlightId;
        i++;
      } else {
        clearInterval(interval);
        // Снимем подсветку с последнего
        setTimeout(() => {
          if (prevId !== null) {
            setNodes((old) =>
              old.map((node) =>
                node.id === prevId ? { ...node, isHighlighted: false } : node
              )
            );
          }
        }, 800);
      }
    }, 800);
  };

  // --------------------------------------------------------------------------------------------
  // Обновляем значение выбранного листа
  const handleUpdate = () => {
    if (!selectedNode) return;
    const [start, end] = selectedNode.range;
    if (start !== end) return; // только лист

    // 1) Вызываем update внутри SegmentTree (без изменения кода SegmentTree!)
    segmentTree.update(start, delta);

    // 2) Перестраиваем визуализацию
    refreshNodes(segmentTree);

    // 3) Ищем новый leafNodeId с диапазоном [start, end] и запускаем подсветку пути
    const leafNode = nodes.find((n) => n.range[0] === start && n.range[1] === end);
    if (leafNode) {
      highlightPathFromLeaf(leafNode.id);
    }

    // 4) Показываем уведомление
    setSnackbarMessage(`Значение узла [${start},${end}] обновлено до ${delta}`);
    setSnackbarOpen(true);

    setSelectedNode(null);
  };

  // --------------------------------------------------------------------------------------------
  // Удаляем выбранный лист
  const handleRemoveLeaf = () => {
    if (selectedNode && selectedNode.range[0] === selectedNode.range[1]) {
      const pos = selectedNode.range[0];
      // Анимация исчезновения
      animateNodeDisappear(selectedNode.id, () => {
        // После исчезновения удалим элемент из массива
        setData((prev) => {
          const updated = [...prev];
          updated.splice(pos, 1);
          updateTreeWithNewData(updated);
          return updated;
        });
      });
      setSelectedNode(null);
    }
  };

  // --------------------------------------------------------------------------------------------
  // Клик по узлу
  const handleNodeClick = (node) => {
    if (node.range[0] === node.range[1]) {
      setSelectedNode(node);
      setDelta(node.value); // По умолчанию текущее значение листа
    }
  };

  // --------------------------------------------------------------------------------------------
  // Snackbar закрыть
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // --------------------------------------------------------------------------------------------
  // Логика для перетаскивания "модального" окна
  const handleEditBoxMouseDown = (e) => {
    setIsDragging(true);
    const offsetX = e.clientX - editBoxPos.x;
    const offsetY = e.clientY - editBoxPos.y;
    setDragOffset({ x: offsetX, y: offsetY });
  };

  const handleEditBoxMouseMove = (e) => {
    if (!isDragging) return;
    // Ограничим положение в пределах Canvas (stageSize.width, stageSize.height)
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    // clamp по X
    const maxX = stageSize.width - 300; // ширину окна берем ~300
    const clampedX = Math.max(0, Math.min(newX, maxX));

    // clamp по Y
    const maxY = stageSize.height - 150; // произвольная высота окна
    const clampedY = Math.max(0, Math.min(newY, maxY));

    setEditBoxPos({ x: clampedX, y: clampedY });
  };

  const handleEditBoxMouseUp = () => {
    setIsDragging(false);
  };

  // --------------------------------------------------------------------------------------------
  // Цвета и стили
  const circleColor = "#4B7BEC";   // Синий
  const highlightColor = "#FFC107"; // Ярко-жёлтый
  const selectedColor = "#34B3F1";  // Голубой
  const lineColor = "#9B59B6";      // Фиолетовый

  // Функция, возвращающая цвет текста в зависимости от фона
  // (Чтобы текст не пропадал, если фон слишком светлый или тёмный)
  const getTextColor = (fill) => {
    // Можно просто сделать жёлтый -> чёрный текст, а синий -> белый
    // Ниже — упрощённая логика
    if (fill === highlightColor) return "#000"; // на ярком жёлтом лучше чёрный
    if (fill === selectedColor) return "#fff";
    if (fill === circleColor) return "#fff";
    return "#fff"; // по умолчанию белый
  };

  // Толщина обводки у листа, чтобы «разделять» листья визуально
  const leafStrokeWidth = 2; 
  const internalNodeStrokeWidth = 1;

  return (
    <Box
      ref={containerRef}
      width="100%"
      // без minHeight, только ширина подстраивается
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="start"
      padding="20px"
      boxSizing="border-box"
      bgcolor="#f8f9fa"
      // Следим за мышью для перетаскивания
      onMouseMove={handleEditBoxMouseMove}
      onMouseUp={handleEditBoxMouseUp}
    >
      <Typography variant="h4" marginBottom={2} sx={{ fontWeight: "bold" }}>
        Segment Tree Visualizer
      </Typography>

      <Box display="flex" justifyContent="center" gap={2} marginBottom={2}>
        <TextField
          label="Новый лист"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          type="number"
          variant="outlined"
          sx={{ width: "150px" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddElement}
          sx={{ borderRadius: "20px" }}
        >
          Добавить
        </Button>
      </Box>

      <Stage width={stageSize.width} height={stageSize.height}>
        <Layer>
          {/* Линии */}
          {nodes.map((parentNode) =>
            parentNode.children.map((childId) => {
              const childNode = nodes.find((n) => n.id === childId);
              if (!childNode) return null;
              return (
                <Line
                  key={`${parentNode.id}-${childId}`}
                  points={[parentNode.x, parentNode.y, childNode.x, childNode.y]}
                  stroke={lineColor}
                  strokeWidth={2}
                  lineCap="round"
                />
              );
            })
          )}

          {/* Узлы */}
          {nodes.map((node) => {
            const isLeaf = node.range[0] === node.range[1];
            // Вычисляем цвет заливки узла
            let fillColor = circleColor;
            if (node.isHighlighted) fillColor = highlightColor;
            else if (selectedNode?.id === node.id) fillColor = selectedColor;

            // Толщина обводки — если лист, пусть будет чуть больше
            const strokeW = isLeaf ? leafStrokeWidth : internalNodeStrokeWidth;

            return (
              <React.Fragment key={node.id}>
                <Circle
                  ref={(el) => (shapeRefs.current[node.id] = el)}
                  x={node.x}
                  y={node.y}
                  radius={30}
                  fill={fillColor}
                  stroke="black"
                  strokeWidth={strokeW}
                  listening={true} 
                  onClick={() => handleNodeClick(node)}
                  // Наведение => курсор pointer
                  onMouseEnter={(e) => {
                    const stage = e.target.getStage();
                    if (stage) stage.container().style.cursor = "pointer";
                  }}
                  onMouseLeave={(e) => {
                    const stage = e.target.getStage();
                    if (stage) stage.container().style.cursor = "default";
                  }}
                  // тени для красоты
                  shadowColor="#000"
                  shadowBlur={4}
                  shadowOffset={{ x: 2, y: 2 }}
                  shadowOpacity={0.2}
                />
                <Text
                  x={node.x - 25}
                  y={node.y - 15}
                  text={`${node.label}\n(${node.value})`}
                  fontSize={12}
                  fill={getTextColor(fillColor)}
                  align="center"
                  width={50}
                />
              </React.Fragment>
            );
          })}
        </Layer>
      </Stage>

      {/* Модальное окно (Box) для редактирования (draggable) */}
      {selectedNode && (
        <Box
          position="absolute"
          // координаты задаём из состояния
          left={editBoxPos.x}
          top={editBoxPos.y}
          bgcolor="#fff"
          padding="20px"
          border="1px solid #ddd"
          borderRadius="10px"
          zIndex={100}
          width="300px"
          boxShadow="0 8px 16px rgba(0,0,0,0.1)"
          // Позволяем user-select (перемещение)
          style={{ userSelect: "none" }}
        >
          {/* Верхняя часть (handle) для перетаскивания */}
          <Box
            onMouseDown={handleEditBoxMouseDown}
            sx={{
              cursor: "move",
              backgroundColor: "#eee",
              padding: "5px 0",
              textAlign: "center",
              fontWeight: "bold",
              borderRadius: "5px"
            }}
          >
            Перетащи меня
          </Box>

          <Typography variant="h6" sx={{ fontWeight: "bold", marginTop: 1 }}>
            Лист: {selectedNode.label}
          </Typography>
          <TextField
            type="number"
            value={delta}
            onChange={(e) => setDelta(parseInt(e.target.value, 10) || 0)}
            fullWidth
            sx={{ marginTop: 1 }}
          />
          <Button
            onClick={handleUpdate}
            variant="contained"
            color="success"
            fullWidth
            sx={{ borderRadius: "20px", marginTop: 1 }}
          >
            Обновить
          </Button>
          <Button
            onClick={handleRemoveLeaf}
            variant="contained"
            color="error"
            fullWidth
            sx={{ borderRadius: "20px", marginTop: 1 }}
          >
            Удалить
          </Button>
        </Box>
      )}

      {/* Snackbar для уведомлений об успехе */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SegmentTreeVisualizer;
