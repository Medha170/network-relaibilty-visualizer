const express = require('express');
const fs = require('fs');
const path = require('path');
const Graph = require('../models/Graph');
const User = require('../models/User');
const mongoose = require('mongoose');

const router = express.Router();
const defaultGraphsPath = path.join(__dirname, '../data/defaultGraphs.json');
const defaultGraphs = JSON.parse(fs.readFileSync(defaultGraphsPath));

// Get all graphs for a user, including default graphs
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const userGraphs = await Graph.find({ user: userId });
    res.json([...defaultGraphs, ...userGraphs]);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching graphs' });
  }
});

// Get a specific graph by ID
router.get('/:id', async (req, res) => {
  let { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      for (const graph of defaultGraphs) {
        if (graph._id === id) {
          return res.json(graph);
        }
      }
    }
    const graph = await Graph.findOne({ _id: id });

    if (!graph) {
      return res.status(404).json({ error: 'Graph not found' });
    }

    res.json(graph);
  } catch (err) {
    console.error('Error fetching graph:', err);
    return res.status(500).json({ error: 'Error fetching graph' });
  }
});


// Adding a new graph
router.post('/', async (req, res) => {
  const { name, nodes, edges, userId } = req.body;

  if (!name || typeof nodes !== 'number' || !Array.isArray(edges) || !userId) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newGraph = await Graph.create({ name, nodes, edges, user: userId });
    res.status(201).json(newGraph);
  } catch (err) {
    res.status(500).json({ error: 'Error saving graph' });
  }
});

// Updating an existing graph
router.put('/:id', async (req, res) => {
  const { name, nodes, edges, userId } = req.body;

  if (!name || typeof nodes !== 'number' || !Array.isArray(edges) || !userId) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const graph = await Graph.findById(req.params.id);
    if (!graph) return res.status(404).json({ error: 'Graph not found' });
    if (graph.readOnly || graph.user.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized or read-only graph' });
    }

    graph.name = name;
    graph.nodes = nodes;
    graph.edges = edges;
    await graph.save();

    res.json(graph);
  } catch (err) {
    res.status(500).json({ error: 'Error updating graph' });
  }
});

// Deleting a graph
router.delete('/:id', async (req, res) => {
  const { userId } = req.body;

  try {
    const graph = await Graph.findById(req.params.id);
    if (!graph) return res.status(404).json({ error: 'Graph not found' });
    if (graph.readOnly || graph.user.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized or read-only graph' });
    }

    await graph.deleteOne();
    res.json({ deleted: graph });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting graph' });
  }
});

module.exports = router;
