import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Footer, Courses, Home } from "./components";
import Landing from "./components/Landing";
import { Navigate } from "react-router-dom";

// only allows logged in users to pass
const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);

function App() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  React.useEffect(() => {
    fetch("/auth").then((res) => {
      setLoggedIn(res.status === 200);
    });
  }, [loggedIn]);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
    <Router>
        <Routes>
          <Route path="/" element={<Landing setLoggedIn={setLoggedIn} />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute user={loggedIn}>
                <Home setLoggedIn={setLoggedIn} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute user={loggedIn}>
                <Courses />
              </ProtectedRoute>
            }
          />
          </Routes>
        <Footer />
      </Router>
    </div>
  );
}

serviceWorker.unregister();
