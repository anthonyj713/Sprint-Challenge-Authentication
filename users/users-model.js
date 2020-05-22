const db = require('../database/dbConfig.js');

module.exports = {
    find, 
    findBy,
    findById,
    add
}

function find() {
    return db('users')
    .select('id', 'username')
};

function findBy(filter) {
    return db('users')
    .where(filter)
};

function findById(id){
    return db('users')
    .where('id', id)
    .first();
};

function add(user){
    return db('users')
    .insert(user, 'id')
    .then(ids => {
        return findById(ids[0])
    });
};