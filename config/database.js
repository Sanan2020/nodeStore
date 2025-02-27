const mongoose = require("mongoose");

try {
  mongoose.connect(process.env.MONGO_URI)
  console.log("Database Connected");
} catch (error) {
  console.error("Database Connection Error:", error);
}

module.exports = mongoose;