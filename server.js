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

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
