import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://gauem741:556677@cluster0.6w3j0.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}