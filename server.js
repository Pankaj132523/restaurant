const express=require('express');
const app=express();
const path=require('path');
const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/config.env` });
const {verifyRoles}=require('./middleware/auth')
const ROLES_LIST=require('./configs/roles')
const dishes = require('./routes/dishes')
const user=require('./routes/user')
const orderroute=require('./routes/order')
const connectDB =require('./configs/db.config');
const cookieParser = require('cookie-parser');

const PORT=process.env.PORT || 3500;
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public','html', 'index.html')));
app.get('/home', (req, res) => res.sendFile(path.join(__dirname, 'public','html', 'home.html')));
app.get('/managerestaurant',verifyRoles(ROLES_LIST.Admin),(req, res) => res.sendFile(path.join(__dirname, 'public','html', 'admin.html')));

app.use('/api/auth',user);
app.use('/api/dishes',dishes)
app.use('/api/orders',orderroute)

const start = async ()=>{
    try {
        await connectDB()
        app.listen(PORT,console.log(`server listening on port ${PORT}`))

    } catch (error) {
        console.log(error)
    }
}
 
start()


