// File config.js
const config = {
    mysql: {
        host: 'localhost',
        port: 3306,
        database: 'ThermalData',
        user: 'root',
        password: 'mysql'
    },
    express: {
        port: 3001 
    }
};

module.exports = config;

// var config = {};
// config.mysql = {};
// config.mysql.host = 'localhost';
// config.mysql.port = 3306;
// config.mysql.database = 'ThermalData';
// config.mysql.user = 'root';
// config.mysql.password = 'mysql';
// config.express = {};0
// config.express.port = 3001;
// module.exports = config;