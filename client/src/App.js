import logo from "./logo.svg";
import "./App.css";
import React from "react";
import { Login } from "./Login.react.tsx";

function App() {
  const [data, setData] = React.useState(null);
  const [done, setDone] = React.useState(false);
  React.useEffect(() => {
    fetch("/index", { method: "GET" })
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>{!data ? "Loading..." : "completed fetch to node.js server"}</p>
        response: {data}
        <Login />
      </header>
    </div>
  );
}

export default App;
