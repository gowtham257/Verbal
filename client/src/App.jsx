import { useEffect, useState } from "react";
import "./App.css";
import EmployeeDirectory from "./EmployeeDirectory";
import Login from "./Login";
import ThemePicker from "./ThemePicker";

const defaultTheme = { bg: "#808080", text: "#ffffff" };

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [username, setUsername] = useState(() => localStorage.getItem("username"));
  const [theme, setTheme] = useState(() => {
    try {
      return { ...defaultTheme, ...JSON.parse(localStorage.getItem("theme")) };
    } catch {
      return defaultTheme;
    }
  });

  useEffect(() => {
    document.documentElement.style.setProperty("--bg-color", theme.bg);
    document.documentElement.style.setProperty("--text-color", theme.text);
    localStorage.setItem("theme", JSON.stringify(theme));
  }, [theme]);

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
            <div className="session-actions">
              <ThemePicker theme={theme} onChange={setTheme} onReset={() => setTheme(defaultTheme)} />
              <button type="button" onClick={handleLogout}>
                Log out
              </button>
            </div>
          </div>
        )}
      </header>

      {token ? <EmployeeDirectory token={token} onUnauthorized={handleLogout} /> : <Login onLogin={handleLogin} />}
    </div>
  );
}

export default App;
