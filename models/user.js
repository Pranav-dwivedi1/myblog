const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  salt: String,
  password: {
    type: String,
    required: true,
  },
  profileImageURL: {
    type: String,
    default: "./public/images/default.jpeg",
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER",
  },
}, { timestamps: true });

// Hash the password before saving
userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();

  const salt = randomBytes(16).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(this.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
  next();
});

// Match password static method
userSchema.statics.matchPassword = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("User not found");

  const userProvidedHash = createHmac("sha256", user.salt)
    .update(password)
    .digest("hex");

  if (user.password !== userProvidedHash) {
    throw new Error("Incorrect password");
  }

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.salt;
  return userObj;
};


const User = model("user", userSchema);
module.exports = User;
