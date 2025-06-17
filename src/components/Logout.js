import React from "react";
const Logout = ({ onLogout }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    if (onLogout) onLogout();
    window.location.href = "/"; 
  };

  return <button onClick={handleLogout}>Logout</button>;
};
export default Logout;
