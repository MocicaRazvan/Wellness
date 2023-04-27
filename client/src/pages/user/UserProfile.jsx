import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import UserInfo from "./UserInfo";
import Overview from "../admin/Overview";
import Daily from "../admin/Daily";
import InfoBar from "../../components/statistics/InfoBar";
import TrainerOverview from "../../components/statistics/TrainerOverview";

import moment from "moment";
import { useLocation } from "react-router-dom";
import CustomSnack from "../../components/reusable/CustomSnack";

const UserProfile = () => {
	const user = useSelector(selectCurrentUser);
	const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
	const { pathname, state } = useLocation();
	const [open, setOpen] = useState(state?.open || false);

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
			<CustomSnack
				open={open}
				setOpen={setOpen}
				message="Profile updated"
				severity="success"
				pathname={pathname}
			/>
			<UserInfo
				user={user}
				width={isNonMobileScreens ? "50%" : "100%"}
				own="true"
			/>
		</Box>
	);
};

export default UserProfile;
