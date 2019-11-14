//const express = require('express');
import express from 'express';
const app = express();
require('dotenv').config({path:"./src/.env"});
process.env.NODE_ENV = 'production';
const bodyParser = require('body-parser');
const cors = require('cors');

const connectDB = require(`./connections/mongo.js`);
const usersRouter = require('./routes/userRouter.js');
const profileRouter = require('./routes/profileRouter.js');
const projectRouter = require('./routes/projectRouter.js');
const funnelRouter = require('./routes/funnelRouter.js');
const collaboratorRouter = require('./routes/collaboratorRouter.js');
const templateRouter = require('./routes/templateRouter.js');
const commentRouter = require('./routes/commentRouter.js')


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '50mb'}));
app.use('/public', express.static(__dirname + '/public'));


app.use('/', usersRouter);
app.use('/profile', profileRouter);
app.use('/project', projectRouter);
app.use('/funnel', funnelRouter);
app.use('/collaborator', collaboratorRouter);
app.use('/template', templateRouter);
app.use('/comment', commentRouter);



app.get("/",(req,res)=>{
    res.send(`Test Funnelsmap`);
});


app.listen(process.env.PORT, () => {
    console.log(`Server runs on http://localhost:${process.env.PORT}; Ctrl+C for exit `);
    connectDB();
});
