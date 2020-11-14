const database = require('../services/database');

module.exports.getGuests = (req, res) => {
    const connection = database.connection;
    console.log('Getting guests!');

    // const result = await connection.execute(`SELECT * FROM GUESTS`);

    console.log(connection);
};