import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import Form from "./Form";

const LoginPage = () => {
	const user = useSelector(selectCurrentUser);
	const { state } = useLocation();
	const theme = useTheme();
	const [title, setTitle] = useState(
		"Welcome to your last day with a shaorma in your hand!",
	);
	const { pathname } = useLocation();
	const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
	console.log({ pathname });
	useEffect(() => {
		if (pathname.includes("login")) {
			setTitle("Have you lost some weight? You look great!");
		} else if (pathname.includes("update")) {
			setTitle(
				"It seems like you changed a bit, update the profile to reflect that!",
			);
		} else if (pathname.includes("register")) {
			setTitle("Welcome to your last day with a shaorma in your hand!");
		}
	}, [pathname]);
	if (user && !state) {
		return <Navigate to="/" />;
	}

	return (
		<Box>
			<Box
				width={isNonMobileScreens ? "50%" : "93%"}
				p="2rem"
				m="2rem auto"
				borderRadius="1.5rem"
				bgcolor={theme.palette.background.alt}>
				<Typography
					variant="h5"
					fontSize={20}
					sx={{
						mb: "1.5rem",
						color: theme.palette.secondary[300],
						fontWeight: "bold",
					}}>
					{title}
				</Typography>
				{state && <Form user={state} />}
				{!state && <Form />}
			</Box>
		</Box>
	);
};

export default LoginPage;
