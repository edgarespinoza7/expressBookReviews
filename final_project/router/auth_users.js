const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Helper function to check if the username is valid
const isValid = (username) => { //returns boolean
  return users.some(user => user.username === username);
}

// Helper function to check if the username and password match the records
const authenticatedUser = (username, password) => { //returns boolean
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body; // Extract username and password from request body

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const user = users.find(u => u.username === username);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  // Generate a JWT token
  const token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });

  // Store the token and username in the session
  req.session.token = token;
  req.session.username = username; // Store the username in the session

  return res.status(200).json({ message: `User "${username}" successfully logged in.`, token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

  const { isbn } = req.params; // Extract ISBN from request parameters
  const { review } = req.query; // Extract review from query parameters
  const username = req.session.username; // Retrieve username from session

  // Validate inputs
  if (!username) {
    return res.status(401).json({ message: "User is not logged in." });
  }

  if (!review) {
    return res.status(400).json({ message: "Review content is required." });
  }

  // Check if the book exists
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }

  // Initialize the reviews object if it doesn't exist
  if (!book.reviews) {
    book.reviews = {};
  }

  // Add or modify the review for the logged-in user
  book.reviews[username] = review;


  return res.status(200).json({
    message: `Review for book with ISBN ${isbn} has been added/updated.`,
    reviews: book.reviews,
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params; // Extract ISBN from the request parameters
  const username = req.user.username; // Extract username from the JWT payload attached by the middleware

  // Check if the book exists
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }

  // Check if reviews exist for the book
  if (!book.reviews || !book.reviews[username]) {
    return res.status(404).json({
      message: `No review found for ISBN ${isbn} by user "${username}".`,
    });
  }

  // Delete the user's review
  delete book.reviews[username];

  return res.status(200).json({
    message: `Review for ISBN ${isbn} by user "${username}" has been deleted.`,
    reviews: book.reviews, // Return the updated reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
