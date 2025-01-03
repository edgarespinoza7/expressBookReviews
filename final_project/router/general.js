const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  try {
    // Check if books data exists
    if (!books || Object.keys(books).length === 0) {
      return res
        .status(404)
        .json({ message: "No books available in the shop." });
    }

    // Return the list of books formatted using JSON.stringify
    const formattedBooks = JSON.stringify(books, null, 2); // Pretty-print with 2-space indentation
    res.setHeader("Content-Type", "application/json"); // Set content type explicitly
    return res.status(200).send(formattedBooks); // Send formatted JSON string
  } catch (error) {
    // Handle unexpected errors
    return res
      .status(500)
      .json({ error: "An error occurred while retrieving books." });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const { isbn } = req.params; // Extract ISBN from request parameters

  try {
    // Check if the book exists in the database
    const book = books[isbn];
    if (!book) {
      return res
        .status(404)
        .json({ message: `Book with ISBN ${isbn} not found.` });
    }

    // Return the book details
    const formattedBook = JSON.stringify(book, null, 2); // Pretty-print with 2-space indentation
    res.setHeader("Content-Type", "application/json"); // Set content type explicitly
    return res.status(200).send(formattedBook); // Send formatted JSON string
  } catch (error) {
    // Handle unexpected errors
    return res
      .status(500)
      .json({ error: "An error occurred while retrieving the book details." });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const { author } = req.params; // Extract author from request parameters

  try {
    // Obtain all keys from the 'books' object and find matching books
    const matchingBooks = Object.keys(books)
      .filter((key) => books[key].author.toLowerCase() === author.toLowerCase())
      .map((key) => books[key]); // Retrieve book details for matching keys

    // If no books match the author, return a 404 response
    if (matchingBooks.length === 0) {
      return res
        .status(404)
        .json({ message: `No books found by author ${author}.` });
    }

    // Return the matching books
    const formattedBooks = JSON.stringify(matchingBooks, null, 2); // Pretty-print with 2-space indentation
    res.setHeader("Content-Type", "application/json"); // Set content type explicitly
    return res.status(200).send(formattedBooks); // Send formatted JSON string
  } catch (error) {
    // Handle unexpected errors
    return res
      .status(500)
      .json({ error: "An error occurred while retrieving the books." });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const { title } = req.params; // Extract title from request parameters

  try {
    // Obtain all keys from the 'books' object and find matching books
    const matchingBooks = Object.keys(books)
      .filter((key) => books[key].title.toLowerCase() === title.toLowerCase())
      .map((key) => books[key]); // Retrieve book details for matching keys

    // If no books match the title, return a 404 response
    if (matchingBooks.length === 0) {
      return res
        .status(404)
        .json({ message: `No books found with title "${title}".` });
    }

    // Return the matching books
    const formattedBooks = JSON.stringify(matchingBooks, null, 2); // Pretty-print with 2-space indentation
    res.setHeader("Content-Type", "application/json"); // Set content type explicitly
    return res.status(200).send(formattedBooks); // Send formatted JSON string
  } catch (error) {
    // Handle unexpected errors
    return res
      .status(500)
      .json({ error: "An error occurred while retrieving the books." });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params; // Extract ISBN from request parameters

  try {
    // Check if the book exists in the database
    const book = books[isbn];
    if (!book) {
      return res
        .status(404)
        .json({ message: `Book with ISBN ${isbn} not found.` });
    }

    // Check if the book has reviews
    const reviews = book.reviews;
    if (!reviews || Object.keys(reviews).length === 0) {
      return res
        .status(404)
        .json({ message: `No reviews available for book with ISBN ${isbn}.` });
    }

    // Return the reviews
    const formattedReviews = JSON.stringify(reviews, null, 2); // Pretty-print with 2-space indentation
    res.setHeader("Content-Type", "application/json"); // Set content type explicitly
    return res.status(200).send(formattedReviews); // Send formatted JSON string
  } catch (error) {
    // Handle unexpected errors
    return res
      .status(500)
      .json({ error: "An error occurred while retrieving the reviews." });
  }
});

module.exports.general = public_users;
