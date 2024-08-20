const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const user = new Schema({
        firstname:{
            type:String,
            required:true
        },
        lastname:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            requires:true
        },
        role:{
            type:Number,
            required:true
        },
        orders:{
            type:Object
        },
        RefreshToken:{
            type:String,
            default:null
        }
    
})

module.exports=mongoose.model('user',user)