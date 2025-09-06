import Book from "../models/Book.js"
import User from "../models/User.js";

export const addBook = async (req, res) => {
    try {
        if(!req.file){
            return res.status(400).json({message : "Book image is required"});
        }

        const image = req.file.filename;

        const { title, author, genre, price, rating, summary } = req.body;
        // Get the latest book (sorted by book_id descending)
        const latestBook = await Book.findOne({}).sort({ book_id: -1 });

        let newBookId = "BOOK001"; // Default if no books exist

        if (latestBook) {
            const latestId = latestBook.book_id; // e.g., "BOOK007"

            // Extract the numeric part and increment
            const numberPart = parseInt(latestId.replace("BOOK", ""));
            const nextNumber = numberPart + 1;

            // Format to BOOK00X
            newBookId = "BOOK" + String(nextNumber).padStart(3, "0");
        }
        
        const existing_book = await Book.findOne({ title: title });
        if (existing_book) {
            return res.status(409).json({ data: existing_book, message: "This book is already exists." })
        }

        const existing_user = await User.findById(req.user._id);
        if (!existing_user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (existing_user && existing_user.role === "seller") {
            const newBook = new Book({ book_id: newBookId, title: title, author: author, genre: genre, price: price, rating: rating, image: image, summary: summary, creator: req.user._id });
            const savedBook = await newBook.save();
            if (!savedBook) {
                return res.status(500).json({ message: "Book could not be added" });
            }
            return res.status(201).json({ data: savedBook, message: "Book added successfully" });
        }
        else
            return res.status(500).json({ message: "Sorry user has to be a seller to add a book." })
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export const getAllBooks = async (req, res) => {
    try {
        const allBooks = await Book.find({ is_deleted: false });
        return res.status(200).json({ data: allBooks, message: "All books retrieved." });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export const getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findOne({book_id: id, is_deleted: false });
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        else {
            return res.status(200).json({ data: book, message: "Found Book" });
        }
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export const updateBook = async (req, res) => {
    try {
        const { id, ...updatedValues } = req.body;
        if(req.file){
            updatedValues.image = req.file.filename;
        }
        const user_id = req.user._id;
        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        //Checking if the current user is the creator

        if (book.creator.toString() !== user_id) {
            return res.status(403).json({ message: "Not authorized to update this book." })
        }

        const updatedBook = await Book.findOneAndUpdate({ _id: id, is_deleted: false }, updatedValues, { new: true, runValidators: true });
        if (!updatedBook) {
            return res.status(500).json({ message: "Not updated" });
        }
        return res.status(200).json({ data: updatedBook, message: "Book updated successfully" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const deleteBook = async (req, res) => {
    try {
        const { id } = req.body;
        const user_id = req.user._id
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: "Book could not be found !" });
        }

        if (book.creator.toString() !== user_id) {
            return res.status(403).json({ message: "Not authorized to delete this book" });
        }

        const deletedProduct = await Book.findOneAndUpdate({ _id: id, is_deleted: false }, { is_deleted: true });
        if (!deletedProduct) {
            return res.status(500).json({ message: "Deletion failed" });
        }
        return res.status(200).json({ data: deletedProduct, message: "Product deleted successfully" });

    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}