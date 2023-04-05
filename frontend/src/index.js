import React from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter as Router,
  Outlet,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import * as serviceWorker from "./serviceWorker";
import { AuthAPI } from "./context";
import Profile from "./components/Profile";
import Footer from "./components/Footer";
import Evaluations from "./components/Evaluations";
import Home from "./components/Home";
import Landing from "./components/Landing";
import Cookies from "js-cookie";

import "./index.css";
// import { useNavigate } from "react-router-dom";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);

function App() {
  const [auth, setAuth] = React.useState(Cookies.get("session"));
  console.log(Cookies.get());
  console.log();
  // only allows logged in users to pass

  // React.useEffect(() => {
  //   const myCookie = Cookies.get('usersession');
  //   console.log("use effect:", myCookie);
  // }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <AuthAPI.Provider value={{ auth, setAuth }}>
        <Endpoints />
      </AuthAPI.Provider>
    </div>
  );
}

function Endpoints() {
  const ProtectedRoute = ({ auth, path, children }) => {
    // const Navigate = useNavigate();
    return auth ? <Outlet /> : <Navigate to="/login" />;
  };

  const Auth = React.useContext(AuthAPI);
  return (
    <Router>
      <div style={{ flexGrow: "1", display: "flex", flexDirection: "column" }}>
        <Routes>
          <Route exact path="/" element={<ProtectedRoute auth={Auth.auth} />}>
            <Route exact path="/" element={<Home />} />
          </Route>
          <Route path="/login" element={<Landing />} />
          <Route
            exact
            path="/home"
            element={<ProtectedRoute auth={Auth.auth} />}
          >
            <Route exact path="/home" element={<Home />} />
          </Route>
          <Route
            exact
            path="/evaluations"
            element={<ProtectedRoute auth={Auth.auth} />}
          >
            <Route exact path="/evaluations" element={<Evaluations />} />
          </Route>
          <Route
            exact
            path="/profile"
            element={<ProtectedRoute auth={Auth.auth} />}
          >
            <Route exact path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

serviceWorker.unregister();
