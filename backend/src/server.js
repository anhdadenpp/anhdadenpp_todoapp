import express from 'express';
import tasksRouter from './routes/tasksRouters.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(cors({origin: 'http://localhost:5173'}));

app.use('/api/tasks', tasksRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error("Database connection error:", error);
});



