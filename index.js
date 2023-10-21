const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors());

const credenciales = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
}

app.get('/productos', (req, res) => {

    var connection = mysql.createConnection(credenciales);
    connection.query('SELECT * FROM productos', (err, results) => {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            return;
        }

        res.json(results);
    });
    connection.end();
});



// Ruta para crear un nuevo producto
app.post('/CrearProductos', (req, res) => {
    const { nombre, marca, modelo, precio, descripcion, imgprincipal, imagenes } = req.body;

    // Validación básica de los datos (puedes agregar más validaciones según tus necesidades)
    if (!nombre || !marca || !modelo || !precio || !descripcion || !imgprincipal) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    // Crea una conexión a la base de datos
    const connection = mysql.createConnection(credenciales);

    // Inserta el nuevo producto en la base de datos
    const sql = 'INSERT INTO productos (nombre, marca, modelo, precio, descripcion, imgprincipal, imagenes) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [nombre, marca, modelo, precio, descripcion, imgprincipal, imagenes];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al crear el producto:', err);
            return res.status(500).json({ message: 'Error al crear el producto' });
        }

        // Producto creado con éxito
        res.status(201).json({ message: 'Producto creado con éxito' });
    });

    // Cierra la conexión a la base de datos
    connection.end();
});





app.listen(5000, () => {
    console.log('Server running on port 5000');
});
