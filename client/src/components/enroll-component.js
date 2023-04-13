/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CoursesService from "../services/courses.service";

const EnrollComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const handleToLogin = () => {
    navigate("/login");
  };

  const [courseData, setCourseData] = useState(null);

  const handleEnroll = (e) => {
    CoursesService.enroll(e.target.id)
      .then(() => {
        window.alert("課程註冊成功!");
        navigate("/course");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    if (currentUser.user.role === "student") {
      CoursesService.getAllCourses()
        .then((data) => {
          setCourseData(data.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [currentUser]); //防止不斷重複執行 http request

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>請先登入才能註冊課程</p>
          <button className="btn btn-primary btn-lg" onClick={handleToLogin}>
            前往登入頁面
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role === "instructor" && (
        <div>
          <h1>只有學生能夠註冊課程</h1>
        </div>
      )}
      {currentUser && courseData && courseData.length !== 0 && (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {courseData.map((course, card, body, a, b, c, d, e) => {
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
                  <p key={e} style={{ margin: "0.5rem 0rem" }}>
                    講師:{course.instructor.username}
                  </p>
                  <a
                    id={course._id}
                    className="card-text btn btn-primary"
                    onClick={handleEnroll}
                  >
                    註冊課程
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EnrollComponent;
