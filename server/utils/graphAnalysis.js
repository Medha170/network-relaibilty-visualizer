function findArticulationPointsAndBridges(nodes, edges) {
  const adj = Array.from({ length: nodes }, () => []);

  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  const visited = new Array(nodes).fill(false);
  const level = new Array(nodes).fill(0);
  const topMostLevelReachable = new Array(nodes).fill(Infinity);
  const isArticulationPoint = new Array(nodes).fill(false);
  const bridges = [];

  function dfsAP(node, parent, curLevel) {
    visited[node] = true;
    level[node] = curLevel;
    topMostLevelReachable[node] = curLevel;

    let childCount = 0;

    for (const nb of adj[node]) {
      if (nb === parent) continue;

      if (!visited[nb]) {
        childCount++;
        dfsAP(nb, node, curLevel + 1);

        topMostLevelReachable[node] = Math.min(
          topMostLevelReachable[node],
          topMostLevelReachable[nb]
        );

        if (parent !== -1 && topMostLevelReachable[nb] >= curLevel) {
          isArticulationPoint[node] = true;
        }
      } else {
        topMostLevelReachable[node] = Math.min(
          topMostLevelReachable[node],
          level[nb]
        );
      }
    }

    if (parent === -1 && childCount > 1) {
      isArticulationPoint[node] = true;
    }
  }

  function dfsBridge(node, parent, curLevel) {
    visited[node] = true;
    level[node] = curLevel;
    topMostLevelReachable[node] = curLevel;

    for (const nb of adj[node]) {
      if (nb === parent) continue;

      if (!visited[nb]) {
        dfsBridge(nb, node, curLevel + 1);

        topMostLevelReachable[node] = Math.min(
          topMostLevelReachable[node],
          topMostLevelReachable[nb]
        );

        if (topMostLevelReachable[nb] > curLevel) {
          bridges.push([node, nb]);
        }
      } else {
        topMostLevelReachable[node] = Math.min(
          topMostLevelReachable[node],
          level[nb]
        );
      }
    }
  }

  // Run articulation point logic
  visited.fill(false);
  topMostLevelReachable.fill(Infinity);
  for (let i = 0; i < nodes; i++) {
    if (!visited[i]) dfsAP(i, -1, 0);
  }

  const articulationPoints = [];
  isArticulationPoint.forEach((val, idx) => {
    if (val) articulationPoints.push(idx);
  });

  // Run bridge logic
  visited.fill(false);
  topMostLevelReachable.fill(Infinity);
  for (let i = 0; i < nodes; i++) {
    if (!visited[i]) dfsBridge(i, -1, 0);
  }

  return { articulationPoints, bridges };
}

module.exports = { findArticulationPointsAndBridges };
