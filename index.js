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

app.get('/productos/detalles', (req, res) => {
    const idProducto = req.query.idproducto;
 // Obtén el idproducto de los parámetros de la ruta
 console.log('ID del producto recibido en la API:', idProducto);

    const connection = mysql.createConnection(credenciales);
    connection.query('SELECT * FROM productos WHERE idproducto = ?', [idProducto], (err, results) => {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            return;
        }

        if (results.length > 0) {
            res.json(results[0]); // Devuelve los detalles del producto encontrado
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
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


// Esta es la nueva ruta para buscar productos
app.get('/buscarProductos', (req, res) => {
    const searchTerm = req.query.term; // Obtiene el término de búsqueda de la consulta

    // Valida que se haya proporcionado un término de búsqueda
    if (!searchTerm) {
        return res.status(400).json({ message: 'Término de búsqueda no proporcionado' });
    }

    // Crea una conexión a la base de datos
    const connection = mysql.createConnection(credenciales);

    // Realiza una consulta SQL para buscar productos que coincidan con el término
    const sql = 'SELECT * FROM productos WHERE nombre LIKE ? OR descripcion LIKE ?';
    const values = [`%${searchTerm}%`, `%${searchTerm}%`];

    connection.query(sql, values, (err, results) => {
        if (err) {
            console.error('Error al buscar productos:', err);
            return res.status(500).json({ message: 'Error al buscar productos' });
        }

        // Envía los resultados de la búsqueda como respuesta
        res.json(results);
    });

    // Cierra la conexión a la base de datos
    connection.end();
});

// Ruta para eliminar un producto por su ID
// Ruta para eliminar un producto por su ID
app.delete('/borrarproductos/:idproducto', (req, res) => {
    const idProducto = req.params.idproducto;
  
    // Crea una conexión a la base de datos
    const connection = mysql.createConnection(credenciales);
  
    // Ejecuta una consulta SQL para eliminar el producto por su ID
    const sql = 'DELETE FROM productos WHERE idproducto = ?';
    const values = [idProducto];
  
    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error al eliminar el producto:', err);
        return res.status(500).json({ message: 'Error al eliminar el producto' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
  
      // Producto eliminado con éxito
      res.json({ message: 'Producto eliminado con éxito' });
    });
  
    // Cierra la conexión a la base de datos
    connection.end();
});

app.put('/actualizarProducto/:id', (req, res) => {
    const idProducto = req.params.id;
    const { nombre, marca, modelo, precio, descripcion, imgprincipal, imagenes } = req.body;
    if (!nombre || !marca || !modelo || !precio || !descripcion || !imgprincipal) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }
    const connection = mysql.createConnection(credenciales);
    const sql = 'UPDATE productos SET nombre = ?, marca = ?, modelo = ?, precio = ?, descripcion = ?, imgprincipal = ?, imagenes = ? WHERE idproducto = ?';
    const values = [nombre, marca, modelo, precio, descripcion, imgprincipal, imagenes, idProducto];
    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al actualizar el producto:', err);
            return res.status(500).json({ message: 'Error al actualizar el producto' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto actualizado con éxito' });
    });
    connection.end();
});

  




app.listen(5000, () => {
    console.log('Server running on port 5000');
});
