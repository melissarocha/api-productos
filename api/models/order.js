const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    total: {type:Number, default:0},
    subTotal: {type:Number, default:0},
    iva: {type:Number, default:0},
    product: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product'}]
  });

module.exports = mongoose.model('Order', orderSchema);
