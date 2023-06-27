import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";
import InfoBar from "../../components/statistics/InfoBar";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import Daily from "../admin/Daily";
import Overview from "../admin/Overview";

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
				color={palette.secondary[300]}
				fontWeight="bold"
				textAlign="center"
				fontSize={{ md: 40, xs: 30 }}>
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
				<Box width="100%" mt={isNonMobileScreens ? 0 : 10}>
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
