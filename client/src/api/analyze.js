import api from './index';

export const analyzeGraph = async ({ nodes, edges }) => {
    console.log(typeof nodes, Array.isArray(edges), edges);
  const res = await api.post('/analyze-graph', { nodes, edges });
  return res.data;
};
