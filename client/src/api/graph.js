import api from './index';

export const getAllGraphs = async (userId) => {
  const res = await api.get(`/graphs`, { params: { userId } });
  return res.data;
};

export const getGraphById = async (graphId) => {
    const res = await api.get(`/graphs/${graphId}`);
    return res.data;
}

export const createGraph = async (graph) => {
  const res = await api.post('/graphs', graph);
  return res.data;
};

export const updateGraph = async (graphId, graph) => {
  const res = await api.put(`/graphs/${graphId}`, graph);
  return res.data;
};

export const deleteGraph = async (graphId, userId) => {
  const res = await api.delete(`/graphs/${graphId}`, {
    data: { userId },
  });
  return res.data;
};
