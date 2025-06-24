import api from './index';

export const loginUser = async (username) => {
  const res = await api.post('/users/login', { username });
  return res.data;
};

export const registerUser = async (username, email) => {
  const res = await api.post('/users/register', { username, email });
  return res.data;
};
