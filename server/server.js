import express from "express"
const app = express();
const port = 3000;

// Sample data - Replace these with your desired objects
const acroynms = [
  { id: 1, name: 'abc' },
  { id: 2, name: 'wtf' },
  { id: 3, name: 'sos' },
];

// Route to get all generic objects
app.get('/api/objects', (req, res) => {
  res.json(acroynms);
});

// Route to get a specific generic object by ID
app.get('/api/objects/:id', (req, res) => {
  const objectId = parseInt(req.params.id);
  const object = acroynms.find((obj) => obj.id === objectId);

  if (!object) {
    return res.status(404).json({ error: 'Object not found' });
  }

  res.json(object);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
