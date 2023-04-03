import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Profile from "./components/Profile";
import Footer from "./components/Footer";
import Evaluations from "./components/Evaluations";
import Home from "./components/Home";
import Landing from "./components/Landing";
// import { Navigate } from "react-router-dom";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);

function App() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  // only allows logged in users to pass
  const AuthRedirect = ({ children }) => {
    if (loggedIn) {
      return children;
    }
    return <Landing setLoggedIn={setLoggedIn} />;
  };
  React.useEffect(() => {
    fetch("/auth").then((res) => {
      setLoggedIn(res.status === 200);
    });
  }, [loggedIn]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Router>
        <div
          style={{ flexGrow: "1", display: "flex", flexDirection: "column" }}
        >
          <Routes>
            <Route
              path="/"
              element={
                loggedIn ? (
                  <Home setLoggedIn={setLoggedIn} />
                ) : (
                  <Landing setLoggedIn={setLoggedIn} />
                )
              }
            />
            <Route
              path="/"
              element={
                loggedIn ? (
                  <Home setLoggedIn={setLoggedIn} />
                ) : (
                  <Landing setLoggedIn={setLoggedIn} />
                )
              }
            />
            <Route
              path="/home"
              element={
                <Home setLoggedIn={setLoggedIn} />
              }
            />
            <Route
              path="/evaluations"
              element={
                <AuthRedirect>
                  <Evaluations setLoggedIn={setLoggedIn} />
                </AuthRedirect>
              }
            />
            <Route
              path="/profile"
              element={
                <AuthRedirect>
                  <Profile setLoggedIn={setLoggedIn} />
                </AuthRedirect>
              }
            />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

serviceWorker.unregister();
