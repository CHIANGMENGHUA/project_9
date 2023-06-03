import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const NavComponent = ({ currentUser, setCurrentUser }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const handleLogout = async () => {
    try {
      AuthService.logout(); // 清除 local storage 內部的 user web token (登出)
      window.location.href = "/"; // 導向首頁
      setCurrentUser(null);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <nav>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link active" to="/">
                    首頁
                  </Link>
                </li>

                {!currentUser && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">
                      註冊會員
                    </Link>
                  </li>
                )}

                {!currentUser && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      會員登入
                    </Link>
                  </li>
                )}

                {currentUser && (
                  <li className="nav-item">
                    <Link onClick={() => setShow(true)} className="nav-link">
                      登出
                    </Link>
                  </li>
                )}

                {currentUser && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/profile">
                      個人頁面
                    </Link>
                  </li>
                )}
                {currentUser && currentUser.user.role === "instructor" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/allCourse">
                      所有課程
                    </Link>
                  </li>
                )}
                {currentUser && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/course">
                      我的課程
                    </Link>
                  </li>
                )}

                {currentUser && currentUser.user.role === "instructor" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/postCourse">
                      新增課程
                    </Link>
                  </li>
                )}

                {currentUser && currentUser.user.role === "student" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/enroll">
                      註冊課程
                    </Link>
                  </li>
                )}
              </ul>
              <Form className="d-flex" style={{ marginLeft: "3rem" }}>
                <Form.Control
                  type="search"
                  placeholder="搜尋課程"
                  className="me-2"
                  aria-label="Search"
                />
                <Button variant="outline-success">Search</Button>
              </Form>
            </div>
          </div>
        </nav>
      </nav>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>登出</Modal.Title>
        </Modal.Header>
        <Modal.Body>您確定要登出嗎？</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            取消
          </Button>
          <Button variant="primary" onClick={handleLogout}>
            确定
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NavComponent;
