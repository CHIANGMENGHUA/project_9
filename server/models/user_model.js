const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 50,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ["student", "instructor"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// 確認用戶身分類型 : student or instructor
userSchema.methods.isStudent = function () {
  return this.role == "student";
};
userSchema.method.isInstructor = function () {
  return this.role == "instructor";
};

// 檢查密碼是否正確
userSchema.methods.comparePassword = async function (password, callback) {
  let result;
  try {
    result = await bcrypt.compare(password, this.password);
    return callback(null, result);
  } catch (e) {
    return callback(e, result);
  }
};

// mongoose middleware
// 若使用者為新用戶，或是正在更改密碼，則將密碼進行雜湊處理
userSchema.pre("save", async function (next) {
  // this 代表 mongoDB 內部的 document
  if (this.isNew || this.isModified("password")) {
    const hashValue = await bcrypt.hash(this.password, 10);
    this.password = hashValue;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
