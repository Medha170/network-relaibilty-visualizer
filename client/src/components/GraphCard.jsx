import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import styles from './GraphCard.module.css';
import { updateGraph } from '../api/graph'; 
import GraphFormModal from './GraphFormModal';
import { useState } from 'react';
import GraphThumbnail from './GraphThumbnail';

export default function GraphCard({ graph, isEditable, onDelete }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();

  const handleEditSubmit = async (updatedData) => {
    try {
      const updatedGraph = await updateGraph(graph._id, {
        ...updatedData,
        userId: graph.user, // keep this if your API needs userId again
        readOnly: graph.readOnly,
      });
      setShowEditModal(false);
      return updatedGraph;
    } catch (err) {
      alert('Failed to update graph: ' + err.message);
      throw err;
    }
  };

  return (
    <div className={styles.card}>
      <GraphThumbnail nodesCount={graph.nodes} edges={graph.edges} />
      <h3>{graph.name}</h3>
      <div className={styles.actions}>
        <button onClick={() => navigate(`/playground/${graph._id}`)}>
          <FontAwesomeIcon icon={faEye} /> View
        </button>
        {isEditable && (
          <>
            <button onClick={() => setShowEditModal(true)}>
              <FontAwesomeIcon icon={faEdit} /> Edit
            </button>
            <button onClick={() => onDelete(graph._id)}>
              <FontAwesomeIcon icon={faTrash} /> Delete
            </button>
          </>
        )}
      </div>

      {showEditModal && (
        <GraphFormModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditSubmit}
          mode="edit"
          initialData={{
            name: graph.name, // not title
            nodes: graph.nodes,
            edges: graph.edges,
          }}
        />
      )}
    </div>
  );
}
