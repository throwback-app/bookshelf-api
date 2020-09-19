const { bookRegisterValidator } = require("../../validations");
const Book = require("../../models/Book");

// TODO: REFACTOR TO ALL!!!!! WARNING

class BookStore {
  create = async (body) => {
    try {
      const validBody = bookRegisterValidator(body);

      if (validBody && validBody.error) {
        throw new Error(validBody.error);
      }

      const isbnBook = await Book.findOne({
        isbn_10: body.isbn_10,
        isbn_13: body.isbn_13,
      });

      if (isbnBook) {
        // TODO: get id user from token and validate
        const userId = "5f6401dc1114466d493ac7d3";

        if (!isbnBook.current_owners.includes(userId)) {
          isbnBook.current_owners.push(userId);
          isbnBook.save();
        }

        return isbnBook;
      }

      const newBook = new Book(validBody);
      const book = Book.create(newBook);

      if (!newBook) {
        throw {
          type: "FAILURE",
          message: "Unexpected error in db",
        };
      }

      return book;
    } catch (error) {
      throw error;
    }
  };
}

module.exports = new BookStore();