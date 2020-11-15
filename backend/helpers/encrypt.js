import bcrypt from "bcrypt";

const saltRounds = 10;

export async function encrypt(text) {
  return await bcrypt.hash(text, saltRounds);
}

export async function encryptWithPhrase(phrase, text) {

}

export async function compare(text, hash) {
  return await bcrypt.compare(text, hash); 
}
