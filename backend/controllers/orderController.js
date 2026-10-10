import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// placing order using COD method
const placeOrder = async (req, res) => {

    try{

        const { userId, items, amount, address, paymentMethod } = req.body;

        const orderData = {
            userId,
            items,
            amount,
            address,
            // FIX: previously hardcoded to "COD" — now reflects whichever
            // method the new checkout UI actually sent (cod / upi / card /
            // netbanking / wallet / paylater). Falls back to "COD" if the
            // frontend didn't send one, so older calls still work.
            paymentMethod: paymentMethod || "COD",
            // NOTE: still always false here. Real "paid" confirmation should
            // only ever be set after a verified callback/webhook from
            // Stripe/Razorpay (once placeOrderStripe / placeOrderRazorpay
            // are implemented) — never just because a payment method other
            // than COD was selected on the client.
            payment: false,
            date: Date.now(),
        }

        const neworder = new orderModel(orderData)
        await neworder.save()

        await userModel.findByIdAndUpdate(userId, {cartData:{}})

        // FIX: was "sucess" (typo) — your frontend checks response.data.success,
        // so this always came back falsy and showed "Failed to place order"
        // even when the order saved correctly.
        res.json({success:true, message:"Order Placed Successfully"})

    } catch(error){
        console.log(error)
        res.json({success:false, message:error.message})
    }

}



// placing order using Stripe method
const placeOrderStripe = async (req, res) => {}



// placing order using Razorpay method
const placeOrderRazorpay = async (req, res) => {}


// All orders data for Admin Panel
const allOrders = async (req, res) => {

    try{

        // FIX: variable was declared as `order` but the response
        // referenced `orders`, which doesn't exist — this threw
        // a ReferenceError on every call.
        const orders = await orderModel.find({})
        res.json({ success:true, orders })

    } catch(error){
        console.log(error)
        res.json({ success:false, message:error.message })
    }

}

// user order Data for frontend
const userOrders = async (req, res) => {
    try{

        const { userId } = req.body;

        const orders = await orderModel.find({ userId });
        res.json({ success:true, orders })

    } catch(error){
        console.log(error)
        res.json({ success:false, message:error.message })
    }
}

// update order status from Admin Panel
const updateStatus = async (req, res) => {
    try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status });

    res.json({ success: true, message: 'Status Updated' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

export { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus }
