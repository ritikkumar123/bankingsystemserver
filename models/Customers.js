const {model,Schema} = require('mongoose')

const CustomerSchema = new Schema({
    name:{
        type: String,
        
    },
    balance:{
        type: Number,

    },
    email:{
        type:String,
    },
    account_number:{
        type:String,

    }

})

const Customer = model('customer',CustomerSchema)


module.exports = Customer;