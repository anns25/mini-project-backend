import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {
        book_id: {
            type: String,
            required: true,
            unique: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        author: {
            type: String,
            required: true,
            trim: true,
            minLength: [3, "Must have at least 3 characters"]
        },
        genre: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        rating: {
            type: Number,
            required: true,
            min: 0,
            max: 5
        },
        image: {
            type: String,
            required: true,
            trim: true
        },
        summary: {
            type: String,
            required: true,
            minLength: [10, "Must have at least 10 characters"],
            trim : true
        },
        is_deleted : {
            type : Boolean,
            default : false
        },
        creator : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        }
    },
    {timestamps : true}
);

    const Book = mongoose.model("Book", bookSchema);
    export default Book