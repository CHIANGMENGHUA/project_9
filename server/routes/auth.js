const router = require("express").Router();
const user = require("../models").user;
const jwt = require("jsonwebtoken");
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;

router.use((req, res, next) => {
  console.log("正在接收一個跟auth有關的請求");
  next();
});

// 註冊
router.post("/register", async (req, res) => {
  // 確認數據是否符合規範
  let { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // 確認信箱是否被註冊過
  const emailExist = await user.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("此信箱已經被註冊過了");

  // 註冊新用戶
  let { username, email, password, role } = req.body;
  let newUser = new user({ username, email, password, role });
  try {
    await newUser.save();
    return res.send({
      message: "成功儲存使用者",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send("無法儲存使用者");
  }
});

// 登入
router.post("/login", async (req, res) => {
  // 確認數據是否符合規範
  let { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // 確認信箱是否被註冊過
  const foundUser = await user.findOne({ email: req.body.email });
  if (!foundUser) {
    return res.status(401).send("查無使用者，此信箱尚未註冊");
  }

  //確認密碼是否正確
  foundUser.comparePassword(req.body.password, (err, isMatch) => {
    if (err) return res.status(500).send(err);
    if (isMatch) {
      // 製作 web token
      const tokenObject = { _id: foundUser._id, email: foundUser.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
      return res.send({
        message: "成功登入",
        token: "JWT " + token,
        user: foundUser,
      });
    } else {
      return res.status(401).send("密碼錯誤");
    }
  });
});

module.exports = router;
