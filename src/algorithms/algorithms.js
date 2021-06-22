export function dijkstra(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);
  while (unvisitedNodes.length !== 0) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    // If we encounter a wall, we skip it.
    if (closestNode.isWall) continue;
    // If the closest node is at a distance of infinity,
    // we must be trapped and should therefore stop.
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighbors(closestNode, grid);
  }
}

export function DFS(grid, startNode, endNode){
  const unvisited = [];
  const vistedNodesInOrder = [];
  startNode.isVisited = true;
  startNode.previousNode = null;
  unvisited.push(startNode);
  vistedNodesInOrder.push(startNode);
  while(unvisited.length !== 0){
      const currentNode = unvisited.pop();
      if(currentNode === endNode){
          return vistedNodesInOrder;
      }
      currentNode.isVisited = true;
      vistedNodesInOrder.push(currentNode);
      let neighbors = getUnvisitedNeighbors(currentNode, grid);

      for (const neighbor of neighbors) {
        neighbor.previousNode = currentNode;
        unvisited.push(neighbor);
      }
    }
  return vistedNodesInOrder;
}

export function BFS(grid, startNode, endNode){
  const unvisited = [];
  const visitedNodesInOrder = [];
  startNode.isVisited = true;
  startNode.previous = null;
  unvisited.push(startNode);
  visitedNodesInOrder.push(startNode);
  while(unvisited.length !== 0){
    let currentNode = unvisited.shift();
    if(currentNode === endNode){
      return visitedNodesInOrder;
    }
    let neighbors = getUnvisitedNeighbors(currentNode, grid);
    for(const neighbor of neighbors){
      neighbor.isVisited = true;
      neighbor.previousNode = currentNode;
      unvisited.push(neighbor);
      visitedNodesInOrder.push(neighbor);
    }
  }
  return visitedNodesInOrder;
}

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
}

function getUnvisitedNeighbors(node, grid) {
  let neighbors = [];
  const {col, row} = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  neighbors = neighbors.filter(neighbor => !neighbor.isVisited);
  return neighbors.filter((neighbor) => !neighbor.isWall);
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

export function getNodesInShortestPathOrder(startNode,finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null && currentNode !== startNode) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  nodesInShortestPathOrder.unshift(startNode);
  return nodesInShortestPathOrder;
}
