const mongoose = require('mongoose');

module.exports = ({type, input}) => {
    let error, Model, instance;
    
    try {
        Model = mongoose.model(type);
        instance = new Model(input);
    } catch(err) {
        error = err;
    }

    return error ? Promise.reject(error) : instance.save();
};
