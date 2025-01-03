const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

const SECRET_KEY = "fingerprint_customer"; // Secret key for JWT

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: SECRET_KEY,
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  // Verify token
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token." });
    }
    req.user = user; // Attach user information to the request
    next(); // Proceed to the next middleware/route handler
  });
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
