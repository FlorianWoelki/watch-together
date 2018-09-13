var mysql = require('mysql')

var connection = null

if (process.env.DB_SOCKET) {
    connection = mysql.createConnection({
        socketPath: process.env.DB_SOCKET,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    })
} else {
    connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    })
}

/*connection.connect((err) => {
    if (err) {
        return console.error('Error: ' + err)
    }

    console.log('Connected to MySQL server.')
})*/

module.exports = connection