const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Sql@9944',
  database: 'node-complete',
  port: 3307,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.use(express.static('public'));
app.use(bodyParser.json());

// Create the 'users' table if not exists
db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL
  )
`);

// API to handle user submission
app.post('/api/users', (req, res) => {
  const { username, phone, email } = req.body;

  const insertQuery = 'INSERT INTO users (username, phone, email) VALUES (?, ?, ?)';
  const selectQuery = 'SELECT * FROM users';

  db.query(insertQuery, [username, phone, email], (err) => {
    if (err) {
      console.error('Error inserting user:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    db.query(selectQuery, (err, users) => {
      if (err) {
        console.error('Error retrieving users:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      res.json(users);
    });
  });
});

app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const deleteQuery = 'DELETE FROM users WHERE id = ?';

  db.query(deleteQuery, [userId], (err) => {
    if (err) {
      console.error('Error deleting user:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json({ message: 'User deleted successfully' });
  });
});

// API to handle user update
app.put('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const { username, phone, email } = req.body;
  const updateQuery = 'UPDATE users SET username = ?, phone = ?, email = ? WHERE id = ?';

  db.query(updateQuery, [username, phone, email, userId], (err) => {
    if (err) {
      console.error('Error updating user:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json({ message: 'User updated successfully' });
  });
});


// API to get all users
app.get('/api/users', (req, res) => {
  const selectQuery = 'SELECT * FROM users';

  db.query(selectQuery, (err, users) => {
    if (err) {
      console.error('Error retrieving users:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json(users);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
