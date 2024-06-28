const Sequelize = require('sequelize');
const connection = require('./database');

const Answer = connection.define('answers', {
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    askid: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    votes: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
},{
    freezeTableName: true // Evita a pluralização do nome da tabela
});

Answer.sync({ force: false }).then(() => {
    console.log("Table 'answers' created if it doesn't exist");
});

module.exports = Answer;
