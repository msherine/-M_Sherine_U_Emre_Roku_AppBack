const sqlCreds = {
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '', // blank for windows, 'root' for mac
    database        : 'db_rokuusers',
    port            : 3306 // 8889 for mac users
}

module.exports = sqlCreds;