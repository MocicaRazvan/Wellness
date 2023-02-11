const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			index: true,
		},
		customerId: { type: String }, // from stripe
		paymentIntentId: { type: String }, //form stripe
		trainings: {
			type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Training" }],
			index: true,
		},
		subTotal: {
			type: Number,
			required: true,
		},
		//with shipping and taxes
		total: {
			type: Number,
			required: true,
		},
		shipping: {
			type: Object,
			required: true,
		},
		deliveryStatus: {
			type: String,
			default: "pending",
		},
		paymentStatus: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
