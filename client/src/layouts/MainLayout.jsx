import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navigation from "../components/Navigation/Navigation";
import { useDispatch, useSelector } from "react-redux";
import {
	logOut,
	selectCurrentToken,
	selectCurrentUser,
	setCredentials,
} from "../redux/auth/authSlice";
import jwtDecode from "jwt-decode";
import { io } from "socket.io-client";
import { initializeSocket } from "../redux/socket/socketSlice";
import Footer from "../components/footer/Footer";
import { Box } from "@mui/material";

const MainLayout = () => {
	const dispatch = useDispatch();
	const token = useSelector(selectCurrentToken);
	const socket = io("ws://localhost:8900");
	const user = useSelector(selectCurrentUser);
	const isAdminPath = useLocation().pathname.includes("admin");
	const { pathname } = useLocation();

	useEffect(() => {
		if (token && user?.id) {
			console.log("io initialize");
			dispatch(initializeSocket({ socket }));
			if (user?.id) {
				socket.emit("addUser", { id: user?.id, mounted: false });
			}
		}
		return () => {
			socket.disconnect();
		};
	}, [dispatch, socket, token, user?.id]);

	useEffect(() => {
		window.document.title = "Wellness";
	}, []);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	useEffect(() => {
		dispatch(setCredentials());
	}, [dispatch]);

	useEffect(() => {
		if (token) {
			const expData = jwtDecode(token).exp;
			const currentTimeInMilisenconds = Math.floor(new Date().getTime() / 1000);
			// console.log({ expData, currentTimeInMilisenconds });
			if (currentTimeInMilisenconds > expData) {
				dispatch(logOut());
			}
		}
	}, [dispatch, token]);

	return (
		<>
			{!isAdminPath && <Navigation />}
			{!isAdminPath && (
				<Box mt={10}>
					<Outlet />
				</Box>
			)}
			{isAdminPath && <Outlet />}
			{!isAdminPath && <Footer />}
		</>
	);
};

export default MainLayout;
