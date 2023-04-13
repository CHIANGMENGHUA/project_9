/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CoursesService from "../services/courses.service";

const CourseComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const handleToLogin = () => {
    navigate("/login");
  };
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    let _id;
    if (currentUser) {
      _id = currentUser.user._id;
      if (currentUser.user.role === "instructor") {
        CoursesService.get(_id)
          .then((data) => {
            setCourseData(data.data);
          })
          .catch((e) => {
            console.log(e);
          });
      } else if (currentUser.user.role === "student") {
        CoursesService.getEnrolledCourses(_id)
          .then((data) => {
            setCourseData(data.data);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
  }, [currentUser]); //防止不斷重複執行 http request

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>請先登入才能查看課程</p>
          <button className="btn btn-primary btn-lg" onClick={handleToLogin}>
            前往登入頁面
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role === "instructor" && (
        <div>
          <h1>歡迎來到講師的課程頁面</h1>
        </div>
      )}
      {currentUser && currentUser.user.role === "student" && (
        <div>
          <h1>歡迎來到學生的課程頁面</h1>
        </div>
      )}
      {currentUser && courseData && courseData.length != 0 && (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {courseData.map((course, card, body, a, b, c, d) => {
            return (
              <div
                key={card}
                className="card"
                style={{ width: "18rem", margin: "1rem" }}
              >
                <div key={body} className="card-body">
                  <h5 key={a} className="card-title">
                    課程名稱:{course.title}
                  </h5>
                  <p
                    key={b}
                    className="card-text"
                    style={{ margin: "0.5rem 0rem" }}
                  >
                    {course.description}
                  </p>
                  <p key={c} style={{ margin: "0.5rem 0rem" }}>
                    學生人數:{course.students.length}
                  </p>
                  <p key={d} style={{ margin: "0.5rem 0rem" }}>
                    課程價格:{course.price}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseComponent;
