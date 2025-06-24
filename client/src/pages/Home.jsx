import { useEffect, useState } from 'react';
import { getAllGraphs, deleteGraph, createGraph } from '../api/graph';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import GraphCard from '../components/GraphCard';
import GraphFormModal from '../components/GraphFormModal';
import styles from './Home.module.css';

export default function Home() {
  const { user } = useUser();
  const [graphs, setGraphs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGraphs = async () => {
      try {
        const res = await getAllGraphs(user._id);
        setGraphs(res);
      } catch (err) {
        alert('Failed to fetch graphs: ' + err.message);
      }
    };
    fetchGraphs();
  }, [user]);

  const handleDelete = async (graphId) => {
    try {
      await deleteGraph(graphId, user._id);
      setGraphs(prev => prev.filter((g) => g._id !== graphId));
    } catch {
      alert('Delete failed');
    }
  };

  const handleCreateGraph = async ({ name, nodes, edges }) => {
    try {
      const newGraph = {
        name: name.trim(),
        userId: user._id,
        readOnly: false,
        nodes: Number(nodes),
        edges,
      };
      const created = await createGraph(newGraph);
      setShowModal(false);
      navigate(`/playground/${created._id}`);
    } catch (err) {
      alert('Error creating graph: ' + (err.response?.data?.message || err.message));
    }
  };


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Your Graphs</h2>
        <button onClick={() => setShowModal(true)}>➕ Create New Graph</button>
      </div>

      <div className={styles.graphGrid}>
        {graphs.map((graph) => {
          const isEditable = !graph.readOnly;
          return (
            <GraphCard
              key={graph._id}
              graph={graph}
              isEditable={isEditable}
              onDelete={handleDelete}
            />
          );
        })}
      </div>

      <GraphFormModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateGraph}
        mode="create"
        initialData={null}
      />
    </div>
  );
}
