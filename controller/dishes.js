const { json } = require('express')
const dishes=require('../model/dishes')

const getDishes = async (req,res)=>{
    const dishe=await dishes.find({})
    res.json(dishe)
}

const addDish =async (req,res)=>{
    console.log(req.body);
    
    const dish={
        dishname:req.body.dishname,
        quantity:req.body.quantity
    }
    const rese =dishes.create(dish);
    res.json(rese)

}

const updateQuantitiy= async (req,res)=>{
    const result = await dishes.updateOne(
        { name: req.body.name },    
        { $set: { quantity: req.body.quantity } } 
    );
    res.send('ok')
}

const deleteDish= async (req,res)=>{
    await dishes.deleteOne({name:req.body.name})
    res.send('ok')
}

module.exports={getDishes,addDish,updateQuantitiy,deleteDish};