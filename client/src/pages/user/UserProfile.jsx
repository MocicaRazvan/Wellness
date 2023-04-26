import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import UserInfo from "./UserInfo";
import Overview from "../admin/Overview";
import Daily from "../admin/Daily";
import InfoBar from "../../components/statistics/InfoBar";
import TrainerOverview from "../../components/statistics/TrainerOverview";

import moment from "moment";

const UserProfile = () => {
	const user = useSelector(selectCurrentUser);
	const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

	if (!user) return <></>;

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
				own="true"
			/>
		</Box>
	);
};

export default UserProfile;
