const Sequelize = require('sequelize');
const connection = require('./database');

const Ask = connection.define('askme', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    category: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true // Evita a pluralização do nome da tabela
});

Ask.sync({ force: false }).then(() => {});

module.exports = Ask;
