import mongoose from "mongoose";

const connect = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("mongodb connected...");
    }
    catch(err){
        console.log("MongoBD connection error", err.message);
    }
}

export default connect;

