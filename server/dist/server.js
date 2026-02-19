import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import prisma from "./config/db";
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    try {
        await prisma.$connect();
        console.log("Database connected successfully");
    }
    catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
});
