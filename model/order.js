const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const orderSchema=new Schema({
    item:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    orderedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    }
})

const order=mongoose.model('order',orderSchema);

module.exports=order;