const mongoose = require('mongoose');

module.exports = ({type, query = {}, select = {}, sort = {}, paging = {}}) => {
    let Model, error;
    const { page = 1, limit = 100 } = paging;

    try {
        Model = mongoose.model(type);
    } catch(err) {
        error = err;
    }

    const results = Model
        .find(query)
        .select(select)
        .sort(sort)
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit));

    return error ? Promise.reject(error) : results;
}