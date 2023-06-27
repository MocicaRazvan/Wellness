import { Box, Typography, useTheme } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TrainerDaily from "../../components/statistics/TrainerDaily";
import TrainerOverview from "../../components/statistics/TrainerOverview";
import { selectCurrentUser } from "../../redux/auth/authSlice";

const Earnings = () => {
	const user = useSelector(selectCurrentUser);
	const navigate = useNavigate();
	const [curUser, setCurUser] = useState(null);
	const { palette } = useTheme();
	const year = moment(user?.createdAt).year();

	useEffect(() => {
		setCurUser(user);
	}, [user]);
	if (curUser?.role === "user") {
		navigate("/");
	}
	if (!curUser) return;
	return (
		<Box sx={{ overflowX: "hidden" }}>
			<Typography
				fontSize={{ md: 40, xs: 30 }}
				mt={2}
				fontWeight="bold"
				textAlign="center"
				color={palette.secondary[300]}>
				Your earnings on the platform
			</Typography>
			<Box width="100%" mt={5} p={2} gap={1}>
				<TrainerOverview userId={curUser?.id} maxYear={year} />
				<Box mt={15}>
					<TrainerDaily userId={curUser?.id} curve="linear" />
				</Box>
			</Box>
		</Box>
	);
};

export default Earnings;
