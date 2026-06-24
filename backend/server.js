const express = require('express');

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
const db = require('./db');


app.use(express.json());

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
 
});

//Sample in-memory data store


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

    const sql =
        "INSERT INTO items (title, description) VALUES (?, ?)";

    db.query(

        sql,

        [title, description],

        (err, result) => {

            console.log("[DATABASE CALLBACK]");

            if(err){

                console.log("[ERROR]");
                console.log("Failed to insert data.");

                console.log(err);

                return res.status(500).json({
                    message:"Database Error"
                });

            }

            console.log("[SUCCESS]");
            console.log("Data inserted successfully.");

            console.log("Inserted ID :", result.insertId);

            console.log("Affected Rows :", result.affectedRows);

            console.log("Inserted Record :");

            console.log({
                id: result.insertId,
                title,
                description
            });

            console.log("[RESPONSE]");
            console.log("Sending response to client.");

            res.status(201).json({

                id: result.insertId,

                title,

                description

            });

        }

    );

});


app.get('/create', (req, res) => {

    console.log("GET /create called");

    const sql = "SELECT * FROM items";

    db.query(sql, (err, result) => {

        if(err){

            console.log("Database Error:", err.message);

            return res.status(500).json({
                message: "Database Error"
            });

        }

        console.log(`Fetched ${result.length} item(s)`);

        res.json(result);

    });

});

app.put('/update/:id', (req, res) => {

    console.log("[REQUEST RECEIVED]");

    const { title, description } = req.body;
    const { id } = req.params;


    const sql =
        "UPDATE items SET title = ?, description = ? WHERE id = ?";

    db.query(
        sql,
        [title, description, id],
        (err, result) => {

            if(err){

                console.log("Database Error:", err.message);

                return res.status(500).json({
                    message: "Database Error"
                });

            }

            if(result.affectedRows === 0){

                console.log(`Item with ID ${id} not found`);

                return res.status(404).json({
                    message: "Item not found"
                });

            }

            console.log(`Item ${id} updated successfully`);

            res.json({
                message: "Item updated successfully",
                id,
                title,
                description
            });

        }
    );

});

