const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: '3307',
    user: 'root',
    password: 'root',
    database: 'todo_db'
});

connection.connect((err) => {
    if(err){
        console.log("Database connection failed");
        console.log(err);
        return;
    }

    console.log("MySQL Connected Successfully!");
});


module.exports = connection;