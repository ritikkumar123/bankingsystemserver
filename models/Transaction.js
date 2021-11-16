const {model,Schema} = require('mongoose')

const TransactionSchema = new Schema({
    from:{
        type: Object,
        
    },
    to:{
        type: Object,
    },
    amount:{
        type:Number,
    },
    timestamp:{
        type:Date,
    },
    client_id:{
        type:String
    }

})

const Transaction = model('transaction',TransactionSchema)


module.exports = Transaction;