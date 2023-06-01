import { connectDatabase } from "./src/database/database.js";
import express from "express";
import dotenv from "dotenv";

import authRoute from "./src/routes/auth.route.js";
import userRoute from "./src/routes/user.route.js";
import postRoute from "./src/routes/post.route.js";

const app = express();
const port = process.env.PORT || 1234;

dotenv.config();
connectDatabase();

app.use(express.json());
app.use("/login", authRoute);
app.use("/user", userRoute);
app.use("/post", postRoute);


app.listen(port, () => console.log(`Ouvindo na porta: ${port}`))