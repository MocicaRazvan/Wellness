const Stripe = require("stripe");
const Order = require("../models/Order");
const User = require("../models/User");
const Training = require("../models/Training");
const { countrys } = require("../utils/shippingCountries");
const makeReceipt = require("../utils/email/receipt");
const sendEmail = require("../utils/email/sendEmail");
const crypto = require("crypto");

//stripe listen --forward-to localhost:5000/stripe/webhook

const stripe = Stripe(process.env.STRIPE_KEY);

//create order
const createOrder = async (customer, data, lineItems) => {
	// const ids = JSON.parse(customer.metadata.cart);
	// const trainingIds = lineItems.data.map((item) => item.description);
	console.log({ lineItems });
	const trainingIds = JSON.parse(customer.metadata.cart);
	console.log({ trainingIds });
	const newOrder = new Order({
		user: customer.metadata.userId,
		customerId: data.customer,
		paymentIntentId: data.payment_intent,
		trainings: trainingIds,
		subTotal: data.amount_subtotal,
		total: data.amount_total,
		shipping: data.customer_details,
		paymentStatus: data.payment_status,
		session: customer.metadata.session,
	});

	console.log({ customer });
	try {
		const savedOrder = await newOrder.save();
		const user = await User.findByIdAndUpdate(customer.metadata.userId, {
			$addToSet: { subscriptions: { $each: trainingIds } },
		});
		await Training.updateMany(
			{ _id: { $in: trainingIds } },
			{ $inc: { occurrences: 1 } },
		);
		const trainings = await Training.find({ _id: { $in: trainingIds } })
			.select("title images price")
			.lean();
		const text = makeReceipt(
			trainings?.map(({ title, images, price }) => ({
				title,
				price,
				url: images[0].url,
			})),
			data.amount_total / 100,
		);
		await sendEmail({
			to: user.email,
			subject: "Order Receipt",
			text,
		});
	} catch (err) {
		console.log(err);
	}
};

//post
exports.stripeCheckout = async (req, res) => {
	const user = await User.findById(req.body.userId).lean();
	const customer = await stripe.customers.create({
		metadata: {
			userId: req.body.userId,
			cart: JSON.stringify(req.body.cartItems.map((item) => item.id)),
			session: crypto.randomBytes(16).toString("hex"),
		},
		email: user.email,
	});
	console.log(req.body.cartItems);

	const line_items = req.body.cartItems.map((item) => ({
		price_data: {
			currency: "usd",
			product_data: {
				// name: item.id,
				name: item.title,
				images: [...item.images.map((img) => img.url)],
				description: item.tags.join(" "),
				metadata: {
					id: item._id,
					// title: item.title,
				},
			},
			unit_amount: item.price * 100,
		},
		quantity: 1,
	}));

	const session = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		shipping_address_collection: {
			allowed_countries: countrys,
		},
		shipping_options: [
			{
				shipping_rate_data: {
					type: "fixed_amount",
					fixed_amount: {
						amount: 0,
						currency: "usd",
					},
					display_name: "Chek the orders page!",
					// Delivers between 5-7 business days
					// delivery_estimate: {
					// 	minimum: {
					// 		unit: "business_day",
					// 		value: 1,
					// 	},
					// 	maximum: {
					// 		unit: "business_day",
					// 		value: 7,
					// 	},
					// },
				},
			},
			// {
			// 	shipping_rate_data: {
			// 		type: "fixed_amount",
			// 		// fixed_amount: {
			// 		// 	amount: 1500,
			// 		// 	currency: "usd",
			// 		// },
			// 		// display_name: "Next day air",
			// 		// Delivers in exactly 1 business day
			// 		delivery_estimate: {
			// 			minimum: {
			// 				unit: "business_day",
			// 				value: 1,
			// 			},
			// 			maximum: {
			// 				unit: "business_day",
			// 				value: 1,
			// 			},
			// 		},
			// 	},
			// },
		],
		phone_number_collection: {
			enabled: true,
		},
		customer: customer.id,
		line_items,
		mode: "payment",
		success_url: `http://localhost:3000/checkout-success?session=${customer.metadata.session}`,
		cancel_url: `http://localhost:3000/cart`,
	});
	const invoice = await stripe.invoices.create({
		customer: customer.id,
		collection_method: "send_invoice",
		days_until_due: 30,
	});
	const sendInvoice = await stripe.invoices.sendInvoice(invoice.id);

	res.status(200).json({ url: session.url });
};

exports.webhook = async (request, response) => {
	const sig = request.headers["stripe-signature"];

	let data;
	let eventType;
	let endpointSecret;

	if (endpointSecret) {
		let event;
		try {
			event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
			console.log("Webhook verified");
		} catch (err) {
			console.log(`Webhook Error: ${err.message}`);
			response.status(400).send(`Webhook Error: ${err.message}`);
			return;
		}
		data = event.data.object;
		eventType = event.type;
	} else {
		data = request.body.data.object;
		eventType = request.body.type;
	}

	// Handle the event
	console.log(eventType);
	if (eventType === "checkout.session.completed") {
		stripe.customers
			.retrieve(data.customer)
			.then((customer) => {
				//console.log(customer);
				//console.log("data:", data);
				stripe.checkout.sessions.listLineItems(
					data.id,
					{},
					function (err, lineItems) {
						if (err) {
							console.log("ses", err);
						}
						createOrder(customer, data, lineItems);
					},
				);
			})
			.catch((err) => console.log("lineitemsErr", err.message));
	}
	// Return a 200 response to acknowledge receipt of the event
	response.send().end();
};
