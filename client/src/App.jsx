import { useState } from "react";
import "./App.css";
import EmployeeDirectory from "./EmployeeDirectory";
import Login from "./Login";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [username, setUsername] = useState(() => localStorage.getItem("username"));

  const handleLogin = (newToken, newUsername) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", newUsername);
    setToken(newToken);
    setUsername(newUsername);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken(null);
    setUsername(null);
  };

  return (
    <div className="page">
      <header className="header">
        <h1>Employee Directory</h1>
        <p>HR tool to add and manage employee records.</p>
        {token && (
          <div className="session-bar">
            <span>Signed in as {username}</span>
            <button type="button" onClick={handleLogout}>
              Log out
            </button>
          </div>
        )}
      </header>

      {token ? <EmployeeDirectory token={token} onUnauthorized={handleLogout} /> : <Login onLogin={handleLogin} />}
    </div>
  );
}

export default App;
