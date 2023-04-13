/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import CoursesService from "../services/courses.service";

const AllCourseComponent = ({ currentUser, setCurrentUser }) => {
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    CoursesService.getAllCourses()
      .then((data) => {
        setCourseData(data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [currentUser]); //防止不斷重複執行 http request

  return (
    <div style={{ padding: "3rem" }}>
      {currentUser && courseData && courseData.length !== 0 && (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {courseData.map((course, card, body, a, b, c, d, e, f) => {
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
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllCourseComponent;
