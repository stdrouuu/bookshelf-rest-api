const {
  addNoteHandler,
  getAllbookHandler,
  getAllbookHandler,
} = require("./handler");

const routes = [
  {
    method: "POST",
    path: "/books",
    handler: addBookHandler,
  },
  {
    method: "GET",
    path: "/books",
    handler: getAllbookHandler,
  },
  {
    method: "GET",
    path: "/books/"
  }
];

module.exports = routes;
