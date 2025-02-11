/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { useGetAuthorQuery } from "../redux/features/auth.api";
const AuthProvider = ({ children }) => {
  const { token } = useSelector((state) => state.auth);

  const { data, isSuccess, isError, isLoading } = useGetAuthorQuery(
    token || ""
  );

  return <>{children}</>;
};

export default AuthProvider;
