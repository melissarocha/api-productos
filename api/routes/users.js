const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');
const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res, next) =>{

  Product.find().exec().then(docs =>{
    console.log(docs);
    //if(docs.lenght >= 0){
    res.status(200).json(docs);
    // }else{
    //   res.status(400).json({
    //   message: 'No entries found'
    // });
  //}
  }).catch(err => {
    console.log(err).json({
      error: err
    });
  });
});

router.post("/", (req, res, next) => {
  const user = new User({
      order: req.body.orderId
  });
  return order.save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Handling POST requests to /users",
        createdUser: result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findOne({_id: id})
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.put("/q/:productId", (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
//   for (let key in req.body) {
//     if (req.body.hasOwnProperty(key)) {
//         console.log(key + " -> " + req.body[key]);
//         updateOps[key] = req.body[key];
//     }
// }
  Product.update({ _id: mongoose.Types.ObjectId(id) }, { $set: req.body })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete('/:productId', (req, res, next) =>{
    const id = req.params.productId;
    Product.remove({_id: id})
    .exec()
    .then(result =>{
      res.status(200).json(result);
    })
    .catch(err =>{
      console.log(err);
      res.status(500).json({
        error: err
      })
    });
});



module.exports = router;
