const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const dishSchema= new Schema({
    dishname:{
        type:String,
        required:true
    },
    quantity:{
        type: Number,
        required:true
    }

})

module.exports=mongoose.model('dishes',dishSchema);