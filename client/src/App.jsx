import "./App.css";
import EmployeeDirectory from "./EmployeeDirectory";

function App() {
  return (
    <div className="page">
      <header className="header">
        <h1>Employee Directory</h1>
        <p>HR tool to add and manage employee records.</p>
      </header>

      <EmployeeDirectory />
    </div>
  );
}

export default App;
