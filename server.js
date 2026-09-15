const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Tuno Cashfree Backend is running"
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "OK"
  });
});

app.post("/create-order", async (req, res) => {
  try {
    const {
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      amount
    } = req.body;

    if (!customerId || !amount) {
      return res.status(400).json({
        success: false,
        error: "customerId and amount are required"
      });
    }

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;

    if (!appId || !secretKey) {
      return res.status(500).json({
        success: false,
        error: "Cashfree credentials are missing"
      });
    }

    const orderId =
      "TUNO_" +
      Date.now() +
      "_" +
      Math.floor(Math.random() * 100000);

    const response = await fetch(
      "https://api.cashfree.com/pg/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": appId,
          "x-client-secret": secretKey,
          "x-api-version": "2025-01-01"
        },
        body: JSON.stringify({
          order_id: orderId,
          order_amount: Number(amount),
          order_currency: "INR",

          customer_details: {
            customer_id: String(customerId),
            customer_name: customerName || "Tuno User",
            customer_email:
              customerEmail || "test@example.com",
            customer_phone:
              customerPhone || "9999999999"
          },

          order_note: "Tuno Video Download Coin Purchase"
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: data.message || "Cashfree order creation failed"
      });
    }

    res.json({
      success: true,
      orderId: data.order_id,
      paymentSessionId: data.payment_session_id,
      orderStatus: data.order_status
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
