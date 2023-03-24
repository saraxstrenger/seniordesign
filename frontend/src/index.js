import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Profile from "./components/Profile";
import Footer from "./components/Footer";
import Courses from "./components/Courses";
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
      console.log(res);
      setLoggedIn(res.status === 200);
    });
  }, [loggedIn]);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              loggedIn ? (
                // <ProtectedRoute user={loggedIn}>
                <Home setLoggedIn={setLoggedIn} />
              ) : (
                // </ProtectedRoute>
                <Landing setLoggedIn={setLoggedIn} />
              )
            }
          />
          <Route
            path="/"
            element={
              loggedIn ? (
                // <ProtectedRoute user={loggedIn}>
                <Home setLoggedIn={setLoggedIn} />
              ) : (
                // </ProtectedRoute>
                <Landing setLoggedIn={setLoggedIn} />
              )
            }
          />
          <Route
            path="/home"
            element={
              // <ProtectedRoute user={loggedIn}>
              <Home setLoggedIn={setLoggedIn} />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <AuthRedirect>
                <Courses setLoggedIn={setLoggedIn} />
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
        <Footer />
      </Router>
    </div>
  );
}

serviceWorker.unregister();
