const orderDb = require('../model/order');
const dishesDb = require('../model/dishes');

const handleOrderPlace = async (req, res) => {
    try {
        const dish = await dishesDb.findOne({ _id: req.body.id });
        if (!dish) return res.status(404).send('Dish not found');

        if (dish.quantity <= 0) {
            return res.status(400).json('Not enough quantity available');
        }

        const order = {
            item: dish.dishname,
            orderedBy: req.userId
        };
        await orderDb.create(order);

        const newQuantity = dish.quantity - 1;
        await dishesDb.updateOne({ _id: req.body.id }, { $set: { quantity: newQuantity } });

        res.json({ success: true });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).send('Internal Server Error');
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await orderDb.find({ orderedBy: req.userId });
        if (!orders.length) return res.status(404).send('No orders found');
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json('Internal Server Error');
    }
};

module.exports = { handleOrderPlace, getMyOrders };
