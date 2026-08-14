import type { AlgorithmStep, VisualItem, VisualKind } from "@/lib/types";

const classFor = (state: VisualItem["state"]) => `visual-state visual-${state ?? "idle"}`;

function ArrayStage({ step }: { step: AlgorithmStep }) {
  const max = Math.max(1, ...step.items.map((item) => Math.abs(item.value ?? Number(item.label) || 0)));
  return (
    <div className="array-stage" aria-label="Визуализация массива">
      {step.items.map((item) => {
        const value = item.value ?? Number(item.label) || 0;
        const height = Math.max(18, (Math.abs(value) / max) * 150);
        return (
          <div className="array-column" key={item.id}>
            <div className={`array-bar ${classFor(item.state)}`} style={{ height }}>
              <strong>{item.label}</strong>
            </div>
            <span>{item.secondary ?? ""}</span>
          </div>
        );
      })}
    </div>
  );
}

function LinearStage({ step, kind }: { step: AlgorithmStep; kind: VisualKind }) {
  const items = kind === "stack" ? [...step.items].reverse() : step.items;
  return (
    <div className={`linear-stage linear-${kind}`}>
      {items.length === 0 ? <div className="empty-state">Пусто</div> : items.map((item) => (
        <div className={`linear-node ${classFor(item.state)}`} key={item.id}>
          <strong>{item.label}</strong>
          {item.secondary ? <small>{item.secondary}</small> : null}
        </div>
      ))}
    </div>
  );
}

function GraphStage({ step }: { step: AlgorithmStep }) {
  const byId = new Map(step.items.map((item) => [item.id, item]));
  return (
    <svg className="graph-stage" viewBox="0 0 100 100" role="img" aria-label="Визуализация графа или дерева">
      <defs>
        <marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <polygon points="0 0, 7 3.5, 0 7" className="graph-arrow" />
        </marker>
      </defs>
      {(step.edges ?? []).map((edge) => {
        const from = byId.get(edge.from);
        const to = byId.get(edge.to);
        if (!from || !to) return null;
        const mx = ((from.x ?? 0) + (to.x ?? 0)) / 2;
        const my = ((from.y ?? 0) + (to.y ?? 0)) / 2;
        return (
          <g key={edge.id} className={classFor(edge.state)}>
            <line
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              className="graph-edge"
              markerEnd={edge.directed ? "url(#arrow)" : undefined}
            />
            {edge.weight !== undefined ? <text x={mx} y={my - 2} className="edge-weight">{edge.weight}</text> : null}
          </g>
        );
      })}
      {step.items.map((item) => (
        <g key={item.id} className={classFor(item.state)}>
          <circle cx={item.x ?? 50} cy={item.y ?? 50} r="5.7" className="graph-node" />
          <text x={item.x ?? 50} y={(item.y ?? 50) + 1.2} textAnchor="middle" className="node-label">{item.label}</text>
          {item.secondary ? <text x={item.x ?? 50} y={(item.y ?? 50) + 9} textAnchor="middle" className="node-secondary">{item.secondary}</text> : null}
        </g>
      ))}
    </svg>
  );
}

export function VisualStage({ step, kind }: { step: AlgorithmStep; kind: VisualKind }) {
  if (kind === "graph" || kind === "tree" || kind === "list") return <GraphStage step={step} />;
  if (kind === "stack" || kind === "queue" || kind === "string") return <LinearStage step={step} kind={kind} />;
  return <ArrayStage step={step} />;
}
