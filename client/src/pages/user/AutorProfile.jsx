import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetUserByIdQuery } from "../../redux/user/userApi";
import { Box, useMediaQuery } from "@mui/material";
import UserInfo from "./UserInfo";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";

const AutorProfile = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
	const userId = useSelector(selectCurrentUser)?.id;

	const { data: user, isError } = useGetUserByIdQuery(
		{ id: location?.state },
		{ skip: !userId },
	);

	if (isError) navigate("/", { replace: true });

	useEffect(() => {
		if (userId === location.state) {
			navigate("/user/profile", { replace: true });
		}
	}, [location.state, navigate, userId]);

	return (
		<Box
			mt={6}
			width="100%"
			p="2rem 6%"
			display="flex"
			justifyContent="center"
			alignItems="center"
			flexDirection="column"
			gap="2rem">
			<UserInfo
				user={user}
				width={isNonMobileScreens ? "50%" : "100%"}
				own="false"
			/>
		</Box>
	);
};

export default AutorProfile;
