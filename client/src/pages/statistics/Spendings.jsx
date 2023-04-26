import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import Overview from "../admin/Overview";
import moment from "moment";
import InfoBar from "../../components/statistics/InfoBar";
import Daily from "../admin/Daily";

const Spendings = () => {
	const user = useSelector(selectCurrentUser);
	const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
	const year = moment(user?.createdAt).year();
	const { palette } = useTheme();
	if (!user) return <></>;
	return (
		<Box
			mt={2}
			p={2}
			display="flex"
			justifyContent="center"
			alignItems="center"
			flexDirection="column"
			gap={5}
			sx={{ overflowX: "hidden" }}>
			<Typography
				variant="h2"
				color={palette.secondary[200]}
				fontWeight="bold"
				textAlign="center"
				fontSize={35}>
				Your spendings on the platform
			</Typography>
			<Box
				width="95%"
				mt={5}
				p={2}
				gap={1}
				display="grid"
				gridTemplateColumns="repeat(2,minmax(0,1fr))"
				sx={{
					"& > div": { gridColumn: isNonMobileScreens ? "span 1" : "span 2" },
				}}>
				<Box width="100%">
					<Overview
						admin={user?.id}
						subtitle="Spendings Overview"
						sales="Amount"
						isProfile={true}
						maxYear={year}
					/>
				</Box>
				<Box width="100%">
					<InfoBar userId={user?.id} maxYear={year} />
				</Box>
			</Box>
			<Box width="95%" mt={15}>
				<Daily
					admin={user?.id}
					isProfile={true}
					title="Daily Spendings"
					subtitle="Chart of daily spendings"
					curve="linear"
				/>
			</Box>
		</Box>
	);
};

export default Spendings;
