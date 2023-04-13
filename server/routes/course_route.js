const router = require("express").Router();
const Course = require("../models/course_model");
const courseValidation = require("../validation").courseValidation;

router.use((req, res, next) => {
  console.log("course route 正在接受一個 request");
  next();
});

// 獲得系統中的所有課程
router.get("/", async (req, res) => {
  try {
    let courseFound = await Course.find({})
      .populate("instructor", ["username", "email", "role"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    console.log(e);
    return res.status(500).send("無法獲取課程資訊");
  }
});

// 用講師 id 來尋找課程
router.get("/instructor/:_instructor_id", async (req, res) => {
  let { _instructor_id } = req.params;
  try {
    let coursesFound = await Course.find({ instructor: _instructor_id })
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(coursesFound);
  } catch (e) {
    console.log(e);
    return res.status(500).send("查詢不到此講師創建課程。");
  }
});

// 用學生 id 來尋找課程
router.get("/student/:_student_id", async (req, res) => {
  let { _student_id } = req.params;
  try {
    let coursesFound = await Course.find({ students: _student_id })
      .populate("students", ["username", "email"])
      .exec();
    return res.send(coursesFound);
  } catch (e) {
    console.log(e);
    return res.status(500).send("查詢不到此學生註冊的課程。");
  }
});

// 用課程名稱來尋找課程
router.get("/findByName/:name", async (req, res) => {
  let { name } = req.params;
  try {
    let courseFound = await Course.find({ title: name })
      .populate("instructor", ["email", "username"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    console.log(e);
    return res.status(500).send("查詢不到相關課程。");
  }
});

// 用課程 id 來尋找課程
router.get("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let courseFound = await Course.findOne({ _id })
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    console.log(e);
    return res.status(500).send("查詢不到相關課程。");
  }
});

// 新增課程
router.post("/", async (req, res) => {
  // 驗證數據符合規範
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // 確認使用者身分為講師
  if (req.user.isStudent()) {
    return res.status(400).send("只有講師才能發布新課程。");
  }
  //創建新課程
  let { title, description, price } = req.body;
  try {
    let newCourse = new Course({
      title,
      description,
      price,
      instructor: req.user._id,
    });
    await newCourse.save();
    return res.send({
      message: "成功創建新課程",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send("無法創建課程");
  }
});

// 讓學生透過課程id註冊新課程
router.post("/enroll/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let course = await Course.findOne({ _id }).exec();
    course.students.push(req.user._id);
    await course.save();
    return res.send("註冊完成");
  } catch (e) {
    console.log(e);
  }
});

// 更改課程
router.patch("/:_id", async (req, res) => {
  // 驗證數據符合規範
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //確認課程存在
  let { _id } = req.params;
  try {
    let courseFound = await Course.findOne({ _id });
    if (!courseFound) {
      return res.status(400).send("找不到課程，無法更新課程內容。");
    }
    // 使用者必須是此課程講師，才能修改課程內容
    if (courseFound.instructor.equals(req.user._id)) {
      let updatedCourse = await Course.findOneAndUpdate({ _id }, req.body, {
        new: true,
        runValidators: true,
      });
      return res.send({
        message: "課程已更新成功。",
        updatedCourse,
      });
    } else {
      return res.status(403).send("只有此課程講師才能修改課程內容");
    }
  } catch (e) {
    console.log(e);
    return res.status(500).send("無法更新課程內容");
  }
});

// 刪除課程
router.delete("/:_id", async (req, res) => {
  //確認課程存在
  let { _id } = req.params;
  try {
    let courseFound = await Course.findOne({ _id }).exec();
    if (!courseFound) {
      return res.status(400).send("找不到課程，無法刪除課程。");
    }
    // 使用者必須是此課程講師，才能刪除課程
    if (courseFound.instructor.equals(req.user._id)) {
      await Course.deleteOne({ _id }).exec();
      return res.send("課程已被刪除");
    } else {
      return res.status(403).send("只有此課程講師才能刪除課程");
    }
  } catch (e) {
    console.log(e);
    return res.status(500).send("無法刪除課程");
  }
});

module.exports = router;
