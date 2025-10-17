import bcrypt from "bcrypt";

const password = "lajarusadmin123"; // password yang kamu mau
const hash = await bcrypt.hash(password, 10);

console.log("Hashed password:", hash);
