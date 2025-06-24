import { useState, useEffect } from 'react';
import styles from './GraphFormModal.module.css';

export default function GraphFormModal({
  show,
  onClose,
  onSubmit,
  mode = 'create',
  initialData
}) {
  const [title, setTitle] = useState('');
  const [nodes, setNodes] = useState('');
  const [edgeList, setEdgeList] = useState([{ from: '', to: '' }]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.name || '');
      setNodes(initialData.nodes?.toString() || '');
      setEdgeList(
        initialData.edges?.map(([from, to]) => ({ from: String(from), to: String(to) })) || 
        [{ from: '', to: '' }]
      );
    }
  }, [initialData]);

  const handleEdgeChange = (index, field, value) => {
    const updated = [...edgeList];
    updated[index][field] = value;
    setEdgeList(updated);
  };

  const handleAddEdge = () => {
    setEdgeList([...edgeList, { from: '', to: '' }]);
  };

  const handleRemoveEdge = (index) => {
    const updated = [...edgeList];
    updated.splice(index, 1);
    setEdgeList(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedEdges = edgeList
      .filter(edge => edge.from !== '' && edge.to !== '')
      .map(edge => [Number(edge.from), Number(edge.to)]);

    onSubmit({
      name: title.trim(),
      nodes: Number(nodes),
      edges: formattedEdges
    });
  };

  if (!show) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>{mode === 'edit' ? 'Edit Graph' : 'Create New Graph'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          /><br />

          <label>Number of Nodes:</label>
          <input
            type="number"
            value={nodes}
            onChange={e => setNodes(e.target.value)}
            min={1}
            required
          /><br />

          <label>Edges:</label>
          {edgeList.map((edge, i) => (
            <div key={i} className={styles.edgeRow}>
              <input
                type="number"
                placeholder="From"
                value={edge.from}
                onChange={e => handleEdgeChange(i, 'from', e.target.value)}
                required
              />
              <span>→</span>
              <input
                type="number"
                placeholder="To"
                value={edge.to}
                onChange={e => handleEdgeChange(i, 'to', e.target.value)}
                required
              />
              {edgeList.length > 1 && (
                <button
                  type="button"
                  className={styles.removeEdgeBtn}
                  onClick={() => handleRemoveEdge(i)}
                >
                  ❌
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddEdge}
            className={styles.addEdgeBtn}
          >
            ➕ Add Edge
          </button>

          <div className={styles.buttonGroup}>
            <button type="submit">
              {mode === 'edit' ? 'Save Changes' : 'Create Graph'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
