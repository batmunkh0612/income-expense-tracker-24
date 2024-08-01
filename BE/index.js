import express from "express";
import fs from "node:fs";
import cors from "cors";
import { db } from "./db.js";

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

app.get("/installExtension", async (req, res) => {
  //table create
  const TableQueryText = `CREATE TABLE IF NOT EXISTS users `;

  try {
    db.query(TableQueryText);

    res.send("success");
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
});

app.get("/createTable", async (req, res) => {
  //table create
  const TableQueryText = `
  CREATE TABLE "users" (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(50)  NOT NULL,
    password TEXT,
    avatar_image TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    currency_type currency_type DEFAULT 'USD' NOT NULL
  );
`;
  try {
    db.query(TableQueryText);

    res.send("success");
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
});

// Create
app.post("/users/create", async (req, res) => {
  const { email, name, password, avatar_image, currency_type } = req.body;
  console.log(email, name, password, avatar_image, currency_type ,'body');
  const queryText = `INSERT INTO users (email, name, password, avatar_image, currency_type) VALUES ($1, $2, $3, $4, $5) RETURNING *`;

  try {
    const result = await db.query(queryText, [
      email,
      name,
      password,
      avatar_image,
      currency_type
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/users", async (req, res) => {
  const queryText = "SELECT * FROM users"
  try {
    const result = await db.query(queryText);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});




// Create
app.post("/items", async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO users (email, name, password, avatar_image, currency_type) VALUES ('batmunkh', 'blabla', )"
      // RETURNING *
      // [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Read
app.get("/items", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items");

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    const result = await db.query(
      "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
      [name, email, id]
    );
    
    if (result.rows.length === 0) {
      res.status(404).json({ error: " not found" });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});








app.get("/items/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM items WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Item not found" });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});





// Update
app.put("/items/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const result = await db.query(
      "UPDATE items SET name = $1, description = $2 WHERE id = $3 RETURNING *",
      [name, description, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Item not found" });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete
app.delete("/items/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "DELETE FROM items WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Item not found" });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// app.get("/createUser", async (req, res) => {
//   const queryText = `
//     INSERT INTO users (name, email)
//     VALUES ('hello', 'hello@gmail.com');
//   `;

//   try {
//     await db.query(queryText);
//   } catch (error) {
//     console.error(error);
//   }

//   res.send("user inserted successfully");
// });

// app.get("/getUsers", async (req, res) => {
//   const queryText = `
//     SELECT name, email FROM users
//   `;

//   try {
//     const result = await db.query(queryText);
//     res.send(result.rows);
//   } catch (error) {
//     console.error(error);
//   }

// });

// app.post("/write", (req, res) => {
//   // req.body -> write
//   const { body } = req;
//   const data = new Uint8Array(Buffer.from(JSON.stringify(body)));

//   fs.writeFile("./DATA.txt", data, "utf8", (err, data) => {
//     console.log(err, data);
//   });

//   res.send("success!");
// });

// app.get("/read", (req, res) => {
//   fs.readFile("./DATA.txt", "utf8", (err, data) => {
//     res.send(data);
//   });
// });

app.listen(port, () => {
  console.log(`my backend listening on port ${port}`);
});
