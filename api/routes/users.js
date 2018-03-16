const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');
const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res, next) =>{
  User.find()
    .populate("order")
    .exec()
    .then(docs => {
        res.status(200).json(docs);
      // res.status(200).json({
      //   count: docs.length,
      //   users: docs.map(doc => {
      //     return {
      //       _id: doc._id,
      //       name: doc.name,
      //       request: {
      //         type: "GET",
      //         url: "http://localhost:3000/tienda/users/" + doc._id
      //       }
      //     };
      //   })
      // });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.post("/", (req, res, next) => {
  let user = new User({
    name: req.body.name
  });
  user
    .save()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
      // res.status(201).json({
      //   message: "Created user successfully",
      //   createdUser: {
      //       name: result.name,
      //       _id: result._id,
      //       request: {
      //           type: 'GET',
      //           url: "http://localhost:3000/tienda/users/" + result._id
      //       }
      //   }
      // });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/:userId", (req, res, next) => {
  const id = req.params.userId;
  User.findOne({_id: id})
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

router.delete('/:userId', (req, res, next) =>{
    const id = req.params.userId;
    User.remove({_id: id})
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



router.put("/q/:userId", (req, res, next) => {
  const id = req.params.userId;
  console.log(id);
  const updateOps = {};
//   for (let key in req.body) {
//     if (req.body.hasOwnProperty(key)) {
//         console.log(key + " -> " + req.body[key]);
//         updateOps[key] = req.body[key];
//     }
// }
  User.update({ _id: mongoose.Types.ObjectId(id) }, { $set: req.body })
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

module.exports = router;
