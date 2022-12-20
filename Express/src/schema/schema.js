
const schema = () => {

    const mongoose = require('mongoose');

    const schemaDraft = new mongoose.Schema({

        first_name : String,
        last_name : String,
        email : String,
        password : String,
        confirm_password : String,
        contact_number : String,
        address : String
    });
    return schemaDraft;
}

module.exports.schemaDraft = schema;