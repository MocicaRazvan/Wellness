import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import Form from "./Form";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";

const CreateTraining = () => {
	const theme = useTheme();
	const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
	const curUser = useSelector(selectCurrentUser);
	const [user, setUser] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		setUser(curUser);
	}, [curUser]);
	if (!user) return;

	if (user?.role === "user") {
		console.log("herer");
		navigate("/");
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
					fontWeight="bold"
					textAlign="center"
					color={theme.palette.secondary[200]}
					letterSpacing={1.5}
					variant="h3"
					sx={{ mb: "1.5rem" }}>
					Create a training from the bottom of your heart
				</Typography>
				<Form />
			</Box>
		</Box>
	);
};

export default CreateTraining;
