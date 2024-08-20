const mongoose= require('mongoose')

const connectDB = async ()=>{
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/restaurant',{
            useNewUrlParser: true, useUnifiedTopology: true 
        })
    } catch (error) {
        console.log(error,'error');
        
    }
}

module.exports = connectDB;