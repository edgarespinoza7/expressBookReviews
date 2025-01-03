const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {

  const { username, password } = req.body; // Extract username and password from request body

  try {
    // Check if username and password are provided
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    // Check if the username already exists
    const userExists = users.some((user) => user.username === username);
    if (userExists) {
      return res
        .status(409)
        .json({ message: `Username "${username}" is already taken.` });
    }

    // Register the new user
    users.push({ username, password });
    return res
      .status(201)
      .json({ message: `User "${username}" successfully registered.` });
  } catch (error) {
    // Handle unexpected errors
    return res
      .status(500)
      .json({ error: "An error occurred while registering the user." });
  }
});

// Get the book list available in the shop
public_users.get("/", (req, res) => {
  // Simulate asynchronous data retrieval
  const getBooks = () => Promise.resolve(books);

  getBooks()
    .then((booksData) => {
      // Check if books data exists
      if (!booksData || Object.keys(booksData).length === 0) {
        return res
          .status(404)
          .json({ message: "No books available in the shop." });
      }

      // Return the list of books formatted using JSON.stringify
      const formattedBooks = JSON.stringify(booksData, null, 2); // Pretty-print with 2-space indentation
      res.setHeader("Content-Type", "application/json"); // Set content type explicitly
      return res.status(200).send(formattedBooks); // Send formatted JSON string
    })
    .catch((error) => {
      // Handle unexpected errors
      return res
        .status(500)
        .json({ error: "An error occurred while retrieving books." });
    });
});


// Get book details based on ISBN
public_users.get("/isbn/:isbn", (req, res) => {
  const { isbn } = req.params; // Extract ISBN from request parameters

  // Simulate an asynchronous operation using a Promise
  const fetchBookByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book); // Resolve the Promise with the book details
      } else {
        reject(new Error(`Book with ISBN ${isbn} not found.`)); // Reject the Promise if book not found
      }
    });
  };

  fetchBookByISBN(isbn)
    .then((book) => {
      // Return the book details
      const formattedBook = JSON.stringify(book, null, 2); // Pretty-print with 2-space indentation
      res.setHeader("Content-Type", "application/json"); // Set content type explicitly
      return res.status(200).send(formattedBook); // Send formatted JSON string
    })
    .catch((error) => {
      if (error.message.includes("not found")) {
        return res.status(404).json({ message: error.message });
      }
      // Handle unexpected errors
      return res
        .status(500)
        .json({ error: "An error occurred while retrieving the book details." });
    });
});

// Get book details based on author
public_users.get("/author/:author", (req, res) => {
  const { author } = req.params; // Extract author from request parameters

  // Simulate an asynchronous operation using a Promise
  const fetchBooksByAuthor = (author) => {
    return new Promise((resolve, reject) => {
      // Obtain all keys from the 'books' object and find matching books
      const matchingBooks = Object.keys(books)
        .filter((key) => books[key].author.toLowerCase() === author.toLowerCase())
        .map((key) => books[key]); // Retrieve book details for matching keys

      // Resolve or reject based on the result
      if (matchingBooks.length > 0) {
        resolve(matchingBooks); // Resolve the Promise with matching books
      } else {
        reject(new Error(`No books found by author ${author}.`)); // Reject the Promise if no matches
      }
    });
  };

  fetchBooksByAuthor(author)
    .then((matchingBooks) => {
      // Return the matching books
      const formattedBooks = JSON.stringify(matchingBooks, null, 2); // Pretty-print with 2-space indentation
      res.setHeader("Content-Type", "application/json"); // Set content type explicitly
      return res.status(200).send(formattedBooks); // Send formatted JSON string
    })
    .catch((error) => {
      if (error.message.includes("No books found")) {
        return res.status(404).json({ message: error.message });
      }
      // Handle unexpected errors
      return res
        .status(500)
        .json({ error: "An error occurred while retrieving the books." });
    });
});

// Get all books based on title
public_users.get("/title/:title", (req, res) => {
  const { title } = req.params; // Extract title from request parameters

  // Simulate an asynchronous operation using a Promise
  const fetchBooksByTitle = (title) => {
    return new Promise((resolve, reject) => {
      // Obtain all keys from the 'books' object and find matching books
      const matchingBooks = Object.keys(books)
        .filter((key) => books[key].title.toLowerCase() === title.toLowerCase())
        .map((key) => books[key]); // Retrieve book details for matching keys

      // Resolve or reject based on the result
      if (matchingBooks.length > 0) {
        resolve(matchingBooks); // Resolve the Promise with matching books
      } else {
        reject(new Error(`No books found with title "${title}".`)); // Reject the Promise if no matches
      }
    });
  };

  fetchBooksByTitle(title)
    .then((matchingBooks) => {
      // Return the matching books
      const formattedBooks = JSON.stringify(matchingBooks, null, 2); // Pretty-print with 2-space indentation
      res.setHeader("Content-Type", "application/json"); // Set content type explicitly
      return res.status(200).send(formattedBooks); // Send formatted JSON string
    })
    .catch((error) => {
      if (error.message.includes("No books found")) {
        return res.status(404).json({ message: error.message });
      }
      // Handle unexpected errors
      return res
        .status(500)
        .json({ error: "An error occurred while retrieving the books." });
    });
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
