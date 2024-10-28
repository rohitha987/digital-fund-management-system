import app from "./app";
import mongoose from "mongoose";
import 'dotenv/config';

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.mongo_uri as string)
.then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

app.listen(PORT, () => {
  console.log('Server is running on port 3000');
});