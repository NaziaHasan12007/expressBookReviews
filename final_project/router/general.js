const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

// Internal helper endpoint returning the raw books dataset
public_users.get('/internal/books', function (req, res) {
  return res.status(200).json(books);
});

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user. Username and password are required." });
});

// Task 10: Get the book list available in the shop using Axios & async/await
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get(`${BASE_URL}/internal/books`);
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving book list", error: err.message });
  }
});

// Task 11: Get book details based on ISBN using Axios & async/await
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`${BASE_URL}/internal/books`);
    const allBooks = response.data;
    if (allBooks[isbn]) {
      return res.status(200).json(allBooks[isbn]);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving book by ISBN", error: err.message });
  }
});

// Task 12: Get book details based on author using Axios & async/await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`${BASE_URL}/internal/books`);
    const allBooks = response.data;
    const matchingBooks = [];

    for (let key in allBooks) {
      if (allBooks[key].author === author) {
        matchingBooks.push(allBooks[key]);
      }
    }

    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res.status(404).json({ message: "No books found by this author" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving books by author", error: err.message });
  }
});

// Task 13: Get all books based on title using Axios & async/await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`${BASE_URL}/internal/books`);
    const allBooks = response.data;
    const matchingBooks = [];

    for (let key in allBooks) {
      if (allBooks[key].title === title) {
        matchingBooks.push(allBooks[key]);
      }
    }

    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res.status(404).json({ message: "No books found with this title" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving books by title", error: err.message });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;