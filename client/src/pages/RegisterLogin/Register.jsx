import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import { useLocation, Navigate } from "react-router-dom";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import Form from "./Form";

const LoginPage = () => {
	const user = useSelector(selectCurrentUser);
	const { state } = useLocation();
	const theme = useTheme();
	const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
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
					Welcome to your last day with a shaorma in your hand!
				</Typography>
				{state && <Form user={state} />}
				{!state && <Form />}
			</Box>
		</Box>
	);
};

export default LoginPage;
