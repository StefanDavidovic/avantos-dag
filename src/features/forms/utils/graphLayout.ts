import type { Node } from "../types/forms.types";

interface PositionedNode {
  node: Node;
  level: number;
  rowIndex: number;
}

interface GraphColumn {
  level: number;
  nodes: PositionedNode[];
}

export interface GraphLayout {
  columns: GraphColumn[];
  positionedNodes: PositionedNode[];
  maxRows: number;
}

export function buildFormGraphLayout(nodes: Node[]): GraphLayout {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const levelMap = new Map<string, number>();

  const computeLevel = (
    nodeId: string,
    stack: Set<string> = new Set()
  ): number => {
    if (levelMap.has(nodeId)) {
      return levelMap.get(nodeId)!;
    }

    const node = nodeMap.get(nodeId);
    if (!node) {
      levelMap.set(nodeId, 0);
      return 0;
    }

    const parents = node.data.prerequisites ?? [];
    if (!parents.length) {
      levelMap.set(nodeId, 0);
      return 0;
    }

    if (stack.has(nodeId)) {
      levelMap.set(nodeId, 0);
      return 0;
    }

    stack.add(nodeId);
    const parentLevels = parents.map((parentId) =>
      computeLevel(parentId, new Set(stack))
    );
    stack.delete(nodeId);

    const level = Math.max(...parentLevels) + 1;
    levelMap.set(nodeId, level);
    return level;
  };

  nodes.forEach((node) => computeLevel(node.id));

  const columnsMap = new Map<number, Node[]>();
  nodes.forEach((node) => {
    const level = levelMap.get(node.id) ?? 0;
    const column = columnsMap.get(level) ?? [];
    column.push(node);
    columnsMap.set(level, column);
  });

  const columns = Array.from(columnsMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map<GraphColumn>(([level, columnNodes]) => ({
      level,
      nodes: columnNodes
        .sort((a, b) => a.data.name.localeCompare(b.data.name))
        .map<PositionedNode>((node, rowIndex) => ({
          node,
          level,
          rowIndex,
        })),
    }));

  const positionedNodes = columns.flatMap((column) => column.nodes);
  const maxRows = columns.reduce(
    (max, column) => Math.max(max, column.nodes.length),
    0
  );

  return {
    columns,
    positionedNodes,
    maxRows,
  };
}
