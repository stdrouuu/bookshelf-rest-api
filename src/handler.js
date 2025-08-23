const { nanoid } = require("nanoid");
const books = require("./books");

// POST /books
const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // 1. Client tidak melampirkan properti name pada request body
  if (!name || name.toString().trim() === "") {
    return h
      .response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      })
      .code(400);
  }

  // 2. readPage lebih besar dari pageCount
  if (
    typeof readPage === "number" &&
    typeof pageCount === "number" &&
    readPage > pageCount
  ) {
    return h
      .response({
        status: "fail",
        message:
          "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
  }

  // 3. buku berhasil dimasukkan
  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const response = h.response({
    status: "success",
    message: "Buku berhasil ditambahkan",
    data: { bookId: id },
  });
  response.code(201);
  return response;
};

// GET /books
const getAllBooksHandler = () => ({
  status: "success",
  data: {
    books: books.map(({ id, name, publisher }) => ({ id, name, publisher })),
  },
});

// GET /books/{bookId}
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.find((b) => b.id === bookId);

  // Id tidak ditemukan
  if (!book) {
    const response = h.response({
      status: "fail",
      message: "Buku tidak ditemukan",
    });
    response.code(404);
    return response;
  }

  return {
    status: "success",
    data: { book },
  };
};

// PUT /books/{bookId}
const updateBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // 1. Client tidak melampirkan properti name pada request body
  if (!name || name.toString().trim() === "") {
    return h
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      })
      .code(400);
  }

  // 2. readPage lebih besar dari pageCount
  if (
    typeof readPage === "number" &&
    typeof pageCount === "number" &&
    readPage > pageCount
  ) {
    return h
      .response({
        status: "fail",
        message:
          "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
  }

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    const updatedAt = new Date().toISOString();
    const finished = pageCount === readPage;

    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading: Boolean(reading),
      finished,
      updatedAt,
    };
    // 3. Id tidak ditemukan
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  }

  // 4. Buku berhasil diperbarui
  const response = h.response({
    status: "success",
    message: "Buku berhasil diperbarui",
  });
  response.code(200);
  return response;
};

// DELETE /books/{bookId}
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  // 1. Id tidak ditemukan
  if (index !== -1) {
    const response = h.response({
      status: "fail",
      message: "Catatan gagal dihapus. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  }

  // 2. Id dimiliki satu buku
  books.splice(index, 1);
  const response = h.response({
    status: "success",
    message: "Catatan berhasil dihapus",
  });
  response.code(200);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
};
