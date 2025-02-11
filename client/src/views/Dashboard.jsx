import { useSelector } from "react-redux";
import CustomerDash from "../components/CustomerDash";
import { Link } from "react-router-dom";
import AdminDashboard from "../components/AdminDashboard";

const Dashboard = () => {
  const auth = useSelector((state) => state.auth);

  if (!auth?.user) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex flex-col justify-center items-center">
        <strong>You are not authorized</strong>
        <Link className="mt-4" to="/login">Login</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="containerMain">
        {auth.user.user.role === "ADMIN" && <AdminDashboard />}

        {auth.user.user.role === "CUSTOMER" && <CustomerDash />}
      </div>
    </div>
  );
};

export default Dashboard;
