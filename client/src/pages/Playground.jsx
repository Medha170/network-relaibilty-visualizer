import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactFlow, { Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { getGraphById } from '../api/graph';
import { analyzeGraph } from '../api/analyze';
import styles from './Playground.module.css';

export default function Playground() {
  const { id } = useParams();

  const [graph, setGraph] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [originalNodes, setOriginalNodes] = useState([]);
  const [originalEdges, setOriginalEdges] = useState([]);
  const [articulationPoints, setArticulationPoints] = useState([]);
  const [bridges, setBridges] = useState([]);
  const [highlightArticulation, setHighlightArticulation] = useState(false);
  const [highlightBridges, setHighlightBridges] = useState(false);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const data = await getGraphById(id);
        setGraph(data);

        const { flowNodes, flowEdges } = toFlowGraph(data.nodes, data.edges);
        setNodes(flowNodes);
        setEdges(flowEdges);
        setOriginalNodes(flowNodes);
        setOriginalEdges(flowEdges);

        const analysis = await analyzeGraph({ nodes: data.nodes, edges: data.edges });
        setArticulationPoints(analysis.articulationPoints);
        setBridges(analysis.bridges);
      } catch (err) {
        console.error('Error loading graph:', err);
      }
    };

    fetchGraph();
  }, [id]);



  const toFlowGraph = (n, edgeList) => {
    const flowNodes = Array.from({ length: n }, (_, i) => ({
      id: i.toString(),
      data: { label: `Node ${i}` },
      position: {
        x: Math.cos((2 * Math.PI * i) / n) * 200 + 300,
        y: Math.sin((2 * Math.PI * i) / n) * 200 + 300,
      },
      style: {
        backgroundColor: '#1f1f1f',
        color: '#fff',
        borderRadius: '50%',
        padding: 10,
        border: '2px solid white',
      },
    }));

    const flowEdges = edgeList.map(([from, to], index) => ({
      id: `e${from}-${to}-${index}`,
      source: from.toString(),
      target: to.toString(),
      animated: true,
      style: { stroke: '#888' },
    }));

    return { flowNodes, flowEdges };
  };

  const toggleArticulation = () => {
    setHighlightArticulation(prev => !prev);
    if (!highlightArticulation) {
      const updated = nodes.map(node =>
        articulationPoints.includes(parseInt(node.id))
          ? { ...node, style: { ...node.style, backgroundColor: 'orange' } }
          : node
      );
      setNodes(updated);
    } else {
      setNodes(originalNodes);
    }
  };

  const toggleBridges = () => {
    setHighlightBridges(prev => !prev);
    if (!highlightBridges) {
      const updated = edges.map(edge => {
        const from = parseInt(edge.source);
        const to = parseInt(edge.target);
        const isBridge = bridges.some(([a, b]) =>
          (a === from && b === to) || (a === to && b === from)
        );
        return isBridge
          ? { ...edge, style: { ...edge.style, stroke: 'red' } }
          : edge;
      });
      setEdges(updated);
    } else {
      setEdges(originalEdges);
    }
  };

  if (!graph) return <div className={styles.container}>Loading graph...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <h2 className={styles.title}>{graph.name}</h2>
        <div className={styles.actions}>
            <button onClick={toggleArticulation} className={`${styles.button} ${styles.orange}`}>
            🔶 Toggle Articulation Points
            </button>
            <button onClick={toggleBridges} className={`${styles.button} ${styles.red}`}>
            🔴 Toggle Bridges
            </button>
        </div>
      </div>

      <div className={styles.graphWrapper}>
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
