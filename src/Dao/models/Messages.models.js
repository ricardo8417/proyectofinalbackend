import mongoose from "mongoose";

const messagesCollection = "messages";

const messagesSchema = new mongoose.Schema({
  user: String,
  message: { type: [String], default: [] },
});

const messagesModel = mongoose.model(messagesCollection, messagesSchema);

export default messagesModel;
