import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

//pages and components
import EmployeeHome from "./pages/EmployeeHome";
import Navbar from "./components/Navbar";
import AdminHome from "./pages/AdminHome";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import EmployeeWorkDetail from "./pages/EmployeeWorkDetail";
import UserProfile from "./pages/UserProfile";
import ProjectUpdate from "./pages/ProjectUpdate";

//hooks
import { useAuthContext } from "./hooks/useAuthContext";


function App() {

  const { user } = useAuthContext();

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route
              path="/"
              element={user ? (user.userType === 'employee' ? <EmployeeHome /> : <AdminHome />) : <Navigate to="/login" />}
            />
            <Route
              path="/signup"
              element={!user ? <Signup /> : <Navigate to="/" />}
            />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/detail"
              element={user ? (user.userType === 'admin' && <EmployeeWorkDetail />) : <Navigate to="/login" />}
            />
            <Route
              path="/profile"
              element={user ? <UserProfile /> : <Navigate to="/login" />}
            />
            <Route
              path="/projectupdate"
              element={user ? <ProjectUpdate /> : <Navigate to="/login" />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
