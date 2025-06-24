import ReactFlow, { Background } from 'reactflow';
import 'reactflow/dist/style.css';
import styles from './GraphThumbnail.module.css';

const toFlowGraph = (n, edgeList) => {
  const flowNodes = Array.from({ length: n }, (_, i) => ({
    id: i.toString(),
    data: { label: '' },
    position: {
      x: Math.cos((2 * Math.PI * i) / n) * 80 + 100,
      y: Math.sin((2 * Math.PI * i) / n) * 80 + 100,
    },
    style: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      backgroundColor: '#555',
    },
  }));

  const flowEdges = edgeList.map(([from, to], index) => ({
    id: `e${from}-${to}-${index}`,
    source: from.toString(),
    target: to.toString(),
    style: { stroke: '#aaa' },
  }));

  return { flowNodes, flowEdges };
};

export default function GraphThumbnail({ nodesCount, edges }) {
  const { flowNodes, flowEdges } = toFlowGraph(nodesCount, edges);

  return (
    <div className={styles.thumbnailWrapper}>
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        panOnScroll={false}
      >
        <Background color="#eee" gap={16} />
      </ReactFlow>
    </div>
  );
}
