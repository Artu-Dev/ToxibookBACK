import { connectDatabase } from "./src/database/database.js";
import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from 'url';

import authRoute from "./src/routes/auth.route.js";
import userRoute from "./src/routes/user.route.js";
import postRoute from "./src/routes/post.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 1234;

dotenv.config();
connectDatabase();

app.use("/files", express.static(path.resolve(__dirname, "tmp", "uploads")));
// app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.urlencoded());
app.use("/login", authRoute);
app.use("/user", userRoute);
app.use("/post", postRoute);


app.listen(port, () => console.log(`Ouvindo na porta: ${port}`))