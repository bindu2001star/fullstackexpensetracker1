const Razorpay = require("razorpay");
const Order = require("../model/order");
const User = require("../model/user");
const singingup = require("./singingup");
const dotenv = require("dotenv");
dotenv.config();
const purchasePremium = async (req, res, next) => {
  try {
    const razor = new Razorpay({
      // key_id: "rzp_test_qcboEyvl05XZ8g",
      // key_secret: "Nf3gpE6kxUiw156dOp6scAp7",
      key_id:process.env.RAZORPAY_KEY_ID,
      key_secret:process.env.RAZORPAY_KEY_SECRET
    });
    const amount = 19999;
    razor.orders.create({ amount, currency: "INR" }, async (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }
      await req.user.createOrder({ orderId: order.id, status: "PENDING" });
      return res.status(201).json({ order, key_id: razor.key_id });
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server is not responding" });
  }
};
const updatetransectionstatus = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const { payment_id, order_id, status } = req.body;
    console.log("requested body:", req.body);
    const order = await Order.findOne({ where: { orderId: order_id } });
    console.log("prints the order here", order);
    if (status === "failed") {
      const promise11 = order.update({
        paymentId: payment_id,
        status: "Failed",
      });
      const promise22 = req.user.update({ ispremiumuser: false });
      Promise.all([promise11, promise22]).then(() => {
        return res
          .status(400)
          .json({ success: false, message: "transection failed" });
      });
    } else {
      const promise1 = order.update({
        paymentId: payment_id,
        status: "SUCCESSFULL",
      });
      const promise2 = req.user.update({ ispremiumuser: true });
      Promise.all([promise1, promise2])
        .then(() => {
          console.log('sing',singingup.generateAccesstoken(userId,true));
          return res
            .status(202)
            .json({ success: true, message: "Transaction Successful" ,token:singingup.generateAccesstoken(userId,true)});
        })
        .catch((err) => {
          throw new Error(err);
        });
    }
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  purchasePremium: purchasePremium,
  updatetransectionstatus: updatetransectionstatus,
  
};
