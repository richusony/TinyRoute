const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      unique: true,
      required: true,
    },
    originalUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const urlModel = mongoose.model("url", urlSchema);

module.exports = {
  urlModel,
};
