import mongoose from "mongoose";

export const connectDatabase  = async () => {
  try {
    console.log("Conectando ao Banco...");
    await mongoose.connect(process.env.MONGOOSE, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log("Conectado com sucesso");
  } catch (err) {
    console.log("erro ao conectar");
    console.log(err);
  }
}


