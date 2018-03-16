const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');
const tiendaRoutes = require('./api/routes/tienda');


mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shop',(error)=>{
  if(error){
    console.log('Error', error);
  }else{
    console.log('Conectado');
  }
}
);
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Routes which should handle requests
app.use('/tienda/products', productRoutes);
app.use('/tienda/orders', orderRoutes);
app.use('/tienda/users', userRoutes);
app.use('/tienda', tiendaRoutes);

app.use((req, res, next)=>{
  const error = new Error('Not found');
  error.status=404;
  next(error);
});

app.use((error, req, res, next)=>{
  res.status(error.status || 500);
  res.json({
    error:{
      message: error.message
    }
  });
});

module.exports = app;
