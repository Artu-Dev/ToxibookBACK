import { generateToken, loginService } from "../services/auth.service.js";
import { getUserDatasByIdService } from "../services/user.service.js";
import bcrypt from "bcryptjs";

export const login = async (req, res) => {
  try {
    const {email, password} = req.body;

    const user = await loginService(email);
    if(!user) return res.status(401).send({message: "Usuario ou senha incorretos!"});

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if(!passwordIsValid) return res.status(401).send({message: "Usuario ou senha incorretos!"});

    const userData = await getUserDatasByIdService(user.id);

    const token = generateToken(user._id);

    res.send({token, userData});
  } catch (error) {
    res.status(500).send({message: error.message})
  }
}
