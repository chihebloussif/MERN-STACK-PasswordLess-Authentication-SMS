const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoute = require ('./routes/auth')
const app = express();

dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(()=> console.log("DB Connected Successfuly")).catch((err)=> {console.log(err)
});

app.use(cors());
app.use(express.json());
app.use('/api/auth',authRoute);

app.listen(process.env.PORT || 5000, ()=> {
    console.log("Backend Server is running");
} )