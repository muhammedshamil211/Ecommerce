import dotenv from 'dotenv';
import app from './src/app.js';
import connectDb from './src/config/db.js';

dotenv.config();
connectDb();
const PORT = process.env.PORT || 4500;


app.listen(PORT, () => {
    console.log(`Server running on PORT:${PORT}`);
});