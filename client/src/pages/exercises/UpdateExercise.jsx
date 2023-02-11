import { useTheme } from "@emotion/react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import Form from "./Form";

const UpdateExercise = () => {
	const { state: exercise } = useLocation();
	const user = useSelector(selectCurrentUser);
	const isAuth = user?.id === exercise?.user;
	const navigate = useNavigate();
	const theme = useTheme();
	const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

	if (!isAuth) navigate("/");

	return (
		<Box>
			<Box
				width={isNonMobileScreens ? "50%" : "93%"}
				p="2rem"
				m="2rem auto"
				borderRadius="1.5rem"
				bgcolor={theme.palette.background.alt}>
				<Typography
					fontWeight="bold"
					textAlign="center"
					color={theme.palette.secondary[200]}
					letterSpacing={1.5}
					variant="h3"
					sx={{ mb: "1.5rem" }}>
					Update your exercise so your soul will be fullfield
				</Typography>
				<Form exercise={exercise} />
			</Box>
		</Box>
	);
};

export default UpdateExercise;
