const mongoose = require('mongoose');

// module.exports = ({id, type, input}) => {
//     let error, result, Model;
    
//     try {
//         Model = mongoose.model(type);
//         result = Model.updateOne({_id: id}, input, {runValidators: true});
//     } catch(err) {
//         error = err;
//     }

//     return error ? Promise.reject(error) : result;
// }


module.exports = ({ id, type, input }) => {
    let Model;

    try {
        Model = mongoose.model(type);
    } catch(err) {
        return Promise.reject(err);
    }

    return Model.findById(id).then((doc) => {
        let error;
        
        doc = Object.keys(input).reduce((acc, curr) => {
            acc.set(curr, input[curr]);
            return acc;
        }, doc);

        return doc.save();
    });
}