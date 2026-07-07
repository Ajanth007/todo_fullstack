const express = require('express');

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
const db = require('./db');
const cors = require('cors');
app.use(cors()); // Enable CORS for all routes

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Create Item
app.post('/create', (req, res) => {
  console.log("\n====================");
  console.log("[REQUEST RECEIVED]");
  console.log("Route      : POST /create");
  console.log("Time       :", new Date().toLocaleString());

  const { title, description } = req.body;

  console.log("[REQUEST BODY]");
  console.log("Title      :", title);
  console.log("Description:", description);

  const sql = "INSERT INTO items (title, description) VALUES (?, ?)";

  db.query(sql, [title, description], (err, result) => {
    console.log("[DATABASE CALLBACK]");

    if (err) {
      console.log("[ERROR]");
      console.log("Failed to insert data.");
      console.log(err);

      return res.status(500).json({
        message: "Database Error",
      });
    }

    console.log("[SUCCESS]");
    console.log("Data inserted successfully.");

    console.log("Inserted ID :", result.insertId);
    console.log("Affected Rows :", result.affectedRows);

    console.log("[RESPONSE]");
    console.log("Sending response to client.");

    return res.status(201).json({
      id: result.insertId,
      title,
      description,
    });
  });
});

// Get All Items
app.get('/create', (req, res) => {
  console.log('GET /create called');

  const sql = 'SELECT * FROM items';

  db.query(sql, (err, result) => {
    if (err) {
      console.log('Database Error:', err.message);
      return res.status(500).json({
        message: 'Database Error',
      });
    }

    console.log(`Fetched ${result.length} item(s)`);
    return res.json(result);
  });
});

// Update Item
app.put('/update/:id', (req, res) => {
  console.log('[REQUEST RECEIVED]');

  const { title, description } = req.body;
  const { id } = req.params;

  const sql = 'UPDATE items SET title = ?, description = ? WHERE id = ?';

  db.query(sql, [title, description, id], (err, result) => {
    if (err) {
      console.log('Database Error:', err.message);
      return res.status(500).json({
        message: 'Database Error',
      });
    }

    if (result.affectedRows === 0) {
      console.log(`Item with ID ${id} not found`);
      return res.status(404).json({
        message: 'Item not found',
      });
    }

    console.log(`Item ${id} updated successfully`);

    return res.json({
      message: 'Item updated successfully',
      id,
      title,
      description,
    });
  });
});

// Delete Item
app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM items WHERE id = ?';
  console.log(`Attempting to delete item with ID: ${id}`);

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: 'Database Error',
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Item not found',
      });
    }

    return res.json({
      message: 'Item deleted successfully',
      id,
    });
  });
});

