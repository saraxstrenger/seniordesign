import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import {
  Navigate,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import {
  Navigation,
  Footer,
  Contact,
  Blog,
  Posts,
  Post,
  Home,
} from "./components";
import Landing from "./components/Landing";

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
    <Router>
      <Navigation />
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
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />}>
          <Route path="" element={<Posts />} />
          <Route path=":postSlug" element={<Post />} />
        </Route>
      </Routes>
      <Footer />
    </Router>
  );
}

serviceWorker.unregister();
