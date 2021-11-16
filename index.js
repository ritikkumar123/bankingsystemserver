const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const Customer = require('./models/Customers')
const Transaction = require('./models/Transaction')

const app = express()

// Middleware 

app.use(express.json())
app.use(cors())

const port = process.env.PORT || 5000;

// routings

app.get('/',async (req,res) => {
    res.status(200).send("Hello World!");
})

app.get('/users',async (req,res) => {
    const users = await Customer.find();
    res.status(200).send(users);
})

app.get('/user/:userid',async (req,res) => {
    const uid = req.params.userid;
    const user = await Customer.find({_id:uid})
    res.status(200).send(user)
})

app.post('/user/new',async (req,res)=>{
    res.status("Testing")
    const {name,email,balance,account_number} = req.body;
    const newCustomer = new Customer({
        name:name,
        balance,
        email,
        account_number:account_number
    })

    newCustomer.save()
    .then(()=>{
        res.status(200).send({message:"User Added!"})
    })
    .catch((err)=>{
        console.log(err.message)
    })
})

app.put('/user/:userid',async (req,res) => {
    

})

app.delete('/user/:userid',async (req,res) => {


})

app.put('/transfer',async (req,res)=>{
    
    const {from,to,amount,timestamp} = req.body;
    // first check if to email and from address is same if return a error
    if(to===from){
        return res.status(403).send({message:"Make sure Reciver Account Number must not be same with Sender Account Number!"})
    }
    // find the to email in database
    const to_user = await Customer.findOne({account_number:to})
    if(!to_user){
        return res.status(403).send({message:"To Email address not found!"})
    }
    // first deduct the balance from from email user
    const user = await Customer.findOne({account_number:from})
    if(user && user.balance< +amount){
        return res.status(403).send({message:"Not enough money to transfer!"})
    }
    const from_user = await Customer.updateOne({account_number:from},{balance:Number(user.balance)-Number(amount)})
    if(!from_user){
        return res.status(500).send({message:"There is some error while transfering Money!Please try Again"})
    }
    Customer.updateOne({account_number:to},{balance:Number(to_user.balance)+Number(amount)}).
    then(()=>{
        

        // create a transaction with this detail
        let newTransaction = new Transaction({
            from:{
                name:user.name,
                email:user.email
            },
            to:{
                name:to_user.name,
                email:to_user.email
            },
            timestamp:timestamp,
            client_id:user._id,
            amount:amount
        })
        newTransaction.save().then(()=>{
            res.status(200).send("Transaction successfully completed!");
            
        })
    })
})

app.get('/transactions',async (req,res)=>{
    const transactions = await Transaction.find();
    res.status(200).send(transactions)
})

app.get('/transaction/:id',async (req,res)=>{
    const {id}=req.params;
    const transaction = await Transaction.findOne({_id:id});
    res.status(200).send(transaction)
})


//  CRUD
//  POST GET PUT DELETE

app.listen(port,()=>{
    mongoose.connect('mongodb+srv://admin-summit:2146255sb8@cluster0.fyuq8.mongodb.net/BankingServer',{ useNewUrlParser: true,useUnifiedTopology: true})
    .then(()=>{
        console.log(`Database connected and server running on ${port}`)
    })
    .catch((err)=>{
        console.log(err.message)
    })
})