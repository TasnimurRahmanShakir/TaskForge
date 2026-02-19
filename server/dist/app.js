import express from "express";
import cors from "cors";
// Import routes here later
// import userRoutes from './routes/userRoutes';
// import projectRoutes from './routes/projectRoutes';
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
// Routes
app.get("/", (req, res) => {
    res.send("API is running...");
});
// app.use('/api/users', userRoutes);
// app.use('/api/projects', projectRoutes);
export default app;
