import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { useLogoutMutation } from "../redux/features/auth.api";
import { setUser } from "../redux/features/auth.slice";

const Header = () => {
  const auth = useSelector((state) => state.auth);
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(setUser({ user: null, token: null }));
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header className="bg-[rgb(26,32,44)] text-white p-4 shadow-md">
      <div className="containerMain mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Complaint Management System
        </Link>
        <nav>
          <ul className="flex gap-4">
            <li>
              <NavLink to="/dashboard" className="hover:underline">
                Dashboard
              </NavLink>
            </li>
            {auth.user ? (
              <li className="cursor-pointer" onClick={handleLogout}>
                Logout
              </li>
            ) : (
              <>
                <li>
                  <NavLink to="/login" className="hover:underline">
                    SignIn
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/register" className="hover:underline">
                    SignUp
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
