import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const Hasingpassword = async (password) => {
  console.log("hasingpassword",password)
  const haspassword = await bcrypt.hash(password, 10);
  return haspassword;
};

//compare password

export const ComparePassword = async (password, hashedPassword) => {
  console.log("comparing password",password, hashedPassword)
  return await bcrypt.compare(password, hashedPassword);
};
//create token with jwt


export const CreateToken = (id) => {
  console.log("creating token", id)
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};