const mongoose = require('mongoose');

module.exports = ({ id, type, input }) => {
    let Model;

    try {
        Model = mongoose.model(type);
    } catch(err) {
        return Promise.reject(err);
    }

    return Model.findById(id).then((doc) => {

        doc = Object.keys(input).reduce((acc, curr) => {
            acc.set(curr, input[curr]);
            return acc;
        }, doc);

        return doc.save();
    });
}