module.exports = {
  setup: async function (db, res, req, params) {
    // Set your secret key. Remember to switch to your live secret key in production.
    // See your keys here: https://dashboard.stripe.com/apikeys
    const stripe = require("stripe")(
      params.config.secret_api_key
    );

    const customer = await stripe.customers.create();
        
    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      usage: params.usage
    });    
    
    return setupIntent;
  },

  confirm: async function (db, res, req, params) {
    // Set your secret key. Remember to switch to your live secret key in production.
    // See your keys here: https://dashboard.stripe.com/apikeys
    const stripe = require("stripe")(
      params.config.secret_api_key
    );

    // retrieve setupIntent
    const setupIntent = await stripe.setupIntents.retrieve(
      params.setup_intent
    );
        
    const paymentIntent = await stripe.paymentIntents.create({
      amount: params.amount,
      currency: params.currency,
      payment_method: setupIntent.payment_method,
      customer: setupIntent.customer
    });

    const paymentConfirmed = await stripe.paymentIntents.confirm(
      paymentIntent.id    
    );
    
    return paymentConfirmed;
  },
};
