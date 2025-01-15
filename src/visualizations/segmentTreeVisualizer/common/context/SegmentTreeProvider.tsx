export const SegmentTreeProvider: React.FC<{ initialData: number[] }> = ({ initialData, children }) => {
  const layerRef = useRef<Konva.Layer>(null);  
  const shapeRefs = useRef<Record<string, Konva.Circle>>({});
  const [data, setData] = useState(initialData);
  const [nodes, setNodes] = useState<VisNode[]>([]);
  const [parentMap, setParentMap] = useState<Record<number, number>>({});
  
  const { updateTreeWithNewData } = useSegmentTree({ initialData: data, shapeRefs, layerRef });

  // Предполагается, что useSegmentTree инициализирует дерево и возвращает необходимые данные
  useEffect(() => {
    // Инициализация дерева при монтировании
    updateTreeWithNewData(data).then((newNodes) => {
      if (newNodes) {
        setNodes(newNodes);
        setParentMap(buildParentMap(newNodes)); // Предполагается, что у вас есть функция buildParentMap
      }
    });
  }, []);