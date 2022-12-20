const schema = () => {

    const mongoose = require('mongoose');

    const schemaDraft = new mongoose.Schema({

        user_Id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "user"
        },
        title : String,
        description : String        
    });
    return schemaDraft;
}

module.exports.post = schema;