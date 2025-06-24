const express = require('express');
const cors = require('cors');
const connectDB = require('./db/connect');
const graphRoutes = require('./routes/graphRoutes');
const userRoutes = require('./routes/userRoutes');
const { findArticulationPointsAndBridges } = require('./utils/graphAnalysis');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/graphs', graphRoutes);
app.use('/api/users', userRoutes);

app.post('/api/analyze-graph', (req, res) => {
  const { nodes, edges } = req.body;
  if (typeof nodes !== 'number' || !Array.isArray(edges)) {
    return res.status(400).json({ error: 'Invalid input format' });
  }
  const {articulationPoints, bridges} = findArticulationPointsAndBridges(nodes, edges);
  res.json({
    articulationPoints,
    bridges
  });
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});