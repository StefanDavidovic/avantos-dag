import type { Node } from "../types/forms.types";

export interface FormGraph {
  adjacency: Map<string, string[]>;
  reverse: Map<string, string[]>;
}

export function buildGraph(nodes: Node[]): FormGraph {
  const adjacency = new Map<string, string[]>();
  const reverse = new Map<string, string[]>();

  for (const node of nodes) {
    const parents = node.data.prerequisites ?? [];

    reverse.set(node.id, parents);

    for (const parentId of parents) {
      if (!adjacency.has(parentId)) adjacency.set(parentId, []);
      adjacency.get(parentId)!.push(node.id);
    }

    if (!adjacency.has(node.id)) adjacency.set(node.id, []);
  }

  return { adjacency, reverse };
}

export function getDirectDependencies(nodeId: string, nodes: Node[]): string[] {
  const node = nodes.find((n) => n.id === nodeId);
  if (!node) return [];

  return node.data.prerequisites ?? [];
}
export function getTransitiveDependencies(
  nodeId: string,
  nodes: Node[]
): string[] {
  const visited = new Set<string>();
  const queue = [...getDirectDependencies(nodeId, nodes)];

  while (queue.length) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);

    const next = getDirectDependencies(current, nodes);
    for (const n of next) {
      if (!visited.has(n)) queue.push(n);
    }
  }

  return Array.from(visited);
}

export function findRootNodes(nodes: Node[]): string[] {
  return nodes
    .filter((node) => !node.data.prerequisites?.length)
    .map((n) => n.id);
}
