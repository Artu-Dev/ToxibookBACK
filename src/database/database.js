import mongoose from "mongoose";

export const connectDatabase  = () => {
  try {
    console.log("Conectando ao Banco...");
    mongoose.connect(process.env.MONGOOSE, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log("Conectado com sucesso");
  } catch (err) {
    console.log(err);
  }
}


