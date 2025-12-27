import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Foods from "./pages/Foods";
import Restaurants from "./pages/Restaurants";
import Orders from "./pages/Orders";
import Users from "./pages/Users";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Tất cả các trang admin đều nằm trong Route này */}
          <Route element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="/" element={<Dashboard />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/foods" element={<Foods />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/users" element={<Users />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;