import mongoose from "mongoose";

const schema = new mongoose.Schema({
  did: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  privateKey: String,
  date: Date,
});

const CredentialModel = mongoose.model("Credential", schema);

export default CredentialModel;
