const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(express.json());

const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'thyler',
    password: 'k',
    database: 'employeedb'
})

conn.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      return;
    }
    console.log('Connected to MySQL database!');
  });

app.use(cors());

app.get('/listEmployees', (req, res) => {
    conn.query('SELECT * FROM Employee', (err, results) => {
        if (err) {
          console.error('Error executing query:', err);
          return;
        }
        console.log('Query results:', results);
        res.send(results)
      });
});

app.delete('/delEmployee/:id', (req, res) => {
    const employeeId = req.params.id;
    
    conn.query('DELETE FROM Employee WHERE id_employee = ?', [employeeId], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).send('Error deleting employee');
      }
      
      console.log('Employee deleted:', results);
      res.send("Employee's records deleted successfully");
    }); 
  });

  app.post('/inEmployee', (req, res) => {
    const {name, salaire} = req.body;
  
    conn.query('INSERT INTO Employee (nom_employee, salaire_employee) VALUES (?,?)', [name,salaire], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).send('Error inserting employee');
      }
      
      console.log('Employee inserted:', results);
      res.send("Employee's records inserted successfully");
    });
  });

  app.post('/modEmployee', (req, res) => {
    const {newName,newSalaire, id} = req.body;
  
    conn.query('UPDATE Employee SET nom_employee = ?, salaire_employee = ? WHERE id_employee = ?', [newName, newSalaire, id], (err, results) => {
        if (err) {
          console.error('Error executing query:', err);
          return res.status(500).send('Error updating employee');
        }
        
        console.log('Employee updated:', results);
        res.send("Employee's records modified successfully");
      });
      
  });

  app.get('/getEmployee/:id', (req, res) => {
    const id = req.params.id;
    conn.query('SELECT * FROM Employee where id_employee = ?', [id] ,(err, results) => {
        if (err) {
          console.error('Error executing query:', err);
          return;
        }
        console.log('Query results:', results);
        res.send(results)
      });
});

app.get('/getSalaire', (req, res) => {
  conn.query('SELECT MAX(salaire_employee) as max, MIN(salaire_employee) as min FROM Employee', (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return;
      }
      console.log('Query results:', results);
      res.send(results)
    });
});
  
  

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
