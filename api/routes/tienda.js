const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');
const Order = require('../models/order');
const Product = require('../models/product');

router.post('/:usuario/addOrder', (req, res, next)=>{
  User.findOne({_id:req.params.usuario})
    .then(usuario => {
      if (!usuario) {
        return res.status(404).json({
          message: "User not found"
        });
      }
      const order = new Order({
        // _id: mongoose.Types.ObjectId()
      });
      order.save();
      usuario.order.push(order);
      usuario.save();
      return res.status(201).json(usuario);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });

});

router.post('/:usuario/:pedido/addProd/:idProd', (req, res, next)=>{
  Order.findById(req.params.pedido)
    .then(order => {
      if (!order) {
        return res.status(404).json({
          message: "Order not found"
        });
      }
      Product.findById(req.params.idProd)
      .then(product => {
        if (!product) {
          return res.status(404).json({
            message: "Product not found"
          });
        }
        order.subTotal += product.quantity * product.price;
        order.iva = order.subTotal * .15;
        order.total += order.subTotal + order.iva;
        order.product.push(product._id);
        order.save();
        return res.status(201).json(order);
      }).catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });;
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/:usuario/:pedido/prods", (req,res,next)=>{
  Order.findById(req.params.pedido)
  .populate('product')
  .then(order => {
    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }
    return res.status(201).json(order.product);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});

router.post('/:usuario/:pedido/prods/delete/:idProd', (req, res, next)=>{
  let productToDelete;
  Order.findById(req.params.pedido)
    .populate("product")
    .then(order => {
      if (!order) {
        return res.status(404).json({
          message: "Order not found"
        });
      }

      order.product.forEach((p,i) => {
        if(p._id == req.params.idProd){
          order.subTotal -= (Number(p.quantity) * p.price);
          order.iva -= (order.subTotal * .15);
          order.total -= (order.subTotal + order.iva);
          order.product.splice(i,1);
          order.save((err)=>{
            if(err){
              return res.status(500).json({
                error: err
              });
            }
            return res.status(200).json(order);

          });
        }
      });

      // Product.findById(req.params.idProd)
      // .then(product => {
      //   if (!product) {
      //     return res.status(404).json({
      //       message: "Product not found"
      //     });
      //   }
      //   for (let i = 0; i < order.product.length; i++) {
      //     if (order.product[i]._id == product._id) {
      //       order.subTotal -= Number(req.params.canti) * product.price;
      //       order.iva -= order.subTotal * .15;
      //       order.total -= order.subTotal + order.iva;
      //       order.product.splice(i,1);
      //       order.save();
      //     }
      //   }
      //   return res.status(201).json(order);
      // }).catch(err => {
      //   console.log(err);
      //   res.status(500).json({
      //     error: err
      //   });
      // });;
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/:usuario/pedidos", (req,res,next)=>{
  User.findById(req.params.usuario)
  .then(user => {
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }
    return res.status(201).json(user.order);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});

router.get("/:usuario/pedido/:id", (req,res,next)=>{
  User.findById(req.params.usuario)
  .then(user => {
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if(user.order.length > 0){
      user.order.forEach(o => {
        console.log("texto antes", o);
        console.log("req.params.id", req.params.id);
        if(o == req.params.id){
          console.log("texto despues");
          Order.findById(req.params.id)
          .then(order => {
            if (!order) {
              return res.status(404).json({
                message: "Order not found"
              });
            }

            return res.status(201).json(order);

          });
        }
      });
    }

    // return res.status(201).json(user.order);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});



module.exports = router;
