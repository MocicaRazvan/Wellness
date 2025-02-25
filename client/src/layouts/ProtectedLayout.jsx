import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectCurrentToken } from "../redux/auth/authSlice";

const ProtectedLayout = () => {
	const token = useSelector(selectCurrentToken);

	return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedLayout;
