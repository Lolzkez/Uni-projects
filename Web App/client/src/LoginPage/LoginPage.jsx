import React from "react";
import axios from "axios"; 
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { Login,ChangePassword } from "../services/Auth-Service";

export const LoginPage = () => {
  const idRef = useRef(null);
  const passwordRef = useRef(null);
  const [error, setError] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const newPassword = useRef(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const loginId = idRef.current.value;
    const loginPassword = passwordRef.current.value;
    Login(loginId, loginPassword).then(userLogin => {
      setId(idRef.current.value);
      setPassword(passwordRef.current.value);
      if (userLogin && userLogin.firstLogin) {
        setShowModal(true);
      } else {
        if (userLogin.role === "student") {
          navigate('/home');
        } else {
          navigate('/dashboard');
        }
      }
    })
  };

  const handlePasswordChange = async (e) => {
    await ChangePassword(id, newPassword.current.value);
    setShowModal(false);
  };

  const createsuperuser = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/dashboard/setup`, {
        id: "admin",
        password: "admin"
      });
    } catch (err) {
      setError("Superuser setup error");
      console.error("Error:", err);
    }
  }
  
  return (
    <div className="login-page">
     { showModal && (
      <div className="modal fade show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Set Your New Password</h5>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="modal-body">
              <input type="password" className="form-control" ref={newPassword} placeholder="New Password"/>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={handlePasswordChange}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    )}

      <div className="right-rectangle">
        <div className="login-title">
          <h3>Welcome</h3>
        </div>
        <form className="login-form" onSubmit={handleLogin}>
          <label className="form-label">Username</label>
          <input className="input-field" 
            placeholder="Username"
            type="default"
            ref={idRef}
          />
          <label className="form-label">Password</label>
          <input className="input-field" 
            placeholder="Password"
            type="password"
            ref={passwordRef}
          />
          {error && <p className="error-message">{error}</p>}
          <button className="form-button" type="submit">Login</button>
        </form>
      </div>

      <div className="left-rectangle">
        <div className="login-blurb">
        <h1>Räumlich</h1>
        <br></br>
        A collaborative platform designed to facilitate excellence in the development of spatial skills by providing students, teachers, and instructors with tools to practice, assess, and manage spatial skill-based tests.
        </div>
        <button onClick={createsuperuser}>Create Superuser</button>
      </div>
        
    </div>
  );
};

