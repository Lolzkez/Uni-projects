import "./style.css";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import { Logout } from "../services/Auth-Service";

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const getTitleForPath = (path) => {
  if (path === "/") return "Login";
  if (path === "/dashboard") return "Dashboard";
  if (path === "/home") return "Home";
  if (path === "/home") return "Home";

  const testsMatch = path.match(/^\/tests\/(\w+)$/);
  if (testsMatch) return `${capitalizeFirstLetter(testsMatch[1])} Tests`;

  const testMatch = path.match(/^\/test\/(\w+)$/);
  if (testMatch) return `Test ${capitalizeFirstLetter(testMatch[1])}`;

  const testResultsMatch = path.match(/^\/test\/(\w+)\/results$/);
  if (testResultsMatch) return `Test Results for ${capitalizeFirstLetter(testResultsMatch[1])}`;
  
  return "Default Title";
};

export const Navbar = () => {
  const name = sessionStorage.getItem('id');
  const role = sessionStorage.getItem('role');
  const location = useLocation();
  const navigate = useNavigate();

  const home = () => {
    if (role == 'student') {
      navigate("/home");
    } else {
      navigate("/dashboard");
    }
  }
  const results = () => {
      navigate("/dashboard/results");
  }
  document.title = getTitleForPath(location.pathname);
  const handleLogout = () => {
      Logout(navigate);
    };

  if (location.pathname === "/") { 
    document.title = "Login";
    return null;
  } 
  
  return (
    <nav className="navbar shadow">
      <button className="btn btn-title ml-4" onClick={home}>Räumlich</button>
      {location.pathname === "/dashboard" && (<button className="btn btn-results" onClick={results}>Results</button>)} 
      
      <div className="d-flex justify-content-end align-items-center">
        <span className="navbar-username">Welcome! {name}</span>
        <button className="logout btn btn-outline-danger" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  )
};


