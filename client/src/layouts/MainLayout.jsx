import { Box } from "@mui/material";
import jwtDecode from "jwt-decode";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import Navigation from "../components/Navigation/Navigation";
import Footer from "../components/footer/Footer";
import ScrollTop from "../components/reusable/ScrollTop";
import {
	logOut,
	selectCurrentToken,
	selectCurrentUser,
	setCredentials,
} from "../redux/auth/authSlice";
import { clearCart } from "../redux/cart/cartSlice";
import { initializeSocket } from "../redux/socket/socketSlice";

const MainLayout = () => {
	const dispatch = useDispatch();
	const token = useSelector(selectCurrentToken);
	const socket = io(process.env.REACT_APP_SOCKET_IO);
	const user = useSelector(selectCurrentUser);
	const isAdminPath = useLocation().pathname.includes("admin");
	const { pathname } = useLocation();

	useEffect(() => {
		if (token && user?.id) {
			console.log("io initialize");
			dispatch(initializeSocket({ socket }));
			if (user?.id) {
				socket.emit("addUser", {
					id: user?.id,
					mounted: false,
					role: user?.role,
				});
			}
		}

		return () => {
			socket.disconnect();
		};
	}, [dispatch, socket, token, user?.id, user?.role]);

	useEffect(() => {
		window.document.title = "Wellness";
	}, []);

	useEffect(() => {
		dispatch(setCredentials());
	}, [dispatch]);

	useEffect(() => {
		if (token === null && !user?.id) {
			dispatch(clearCart());
		}
	}, [dispatch, token, user?.id]);

	useEffect(() => {
		if (user?.role === "admin" && socket) {
			socket.emit("mountUserConv", {
				convId: "conversatieInexistenta",
				userId: user?.id,
				role: user?.role,
			});
		}
	}, [socket, user?.id, user?.role]);

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

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return (
		<Box>
			<ScrollTop />
			{!isAdminPath && <Navigation />}
			{!isAdminPath && (
				<Box mt={10}>
					<Outlet />
				</Box>
			)}
			{isAdminPath && <Outlet />}
			{!isAdminPath && <Footer />}
		</Box>
	);
};

export default MainLayout;
