import { useTheme } from "@emotion/react";
import {
	Box,
	CircularProgress,
	Typography,
	useMediaQuery,
} from "@mui/material";
import React from "react";
import FlexBetween from "../../components/reusable/FlexBetween";
import Header from "../../components/reusable/Header";
import {
	useGetAdminRelativeStatsQuery,
	useGetAllCountAdminQuery,
} from "../../redux/user/userApi";
import {
	DownloadOutlined,
	Email,
	Book,
	DirectionsRun,
	FitnessCenter,
} from "@mui/icons-material";
import StatBox from "../../components/admin/StatBox";
import OverviewChart from "../../components/admin/OverviewChart";
import UsersDataGrid from "../../components/admin/UsersDataGrid";
import BreakdownChart from "../../components/admin/BreakdownChart";
import { useOutletContext } from "react-router-dom";

const Dashboard = () => {
	const theme = useTheme();
	const isNonMediumScreens = useMediaQuery("(min-width: 1250px)");
	const isNonSmallScreens = useMediaQuery("(min-width: 620px)");
	const { data: relativeStats, isLoading: isStatsLoading } =
		useGetAdminRelativeStatsQuery(null, { refetchOnFocus: true });
	const { data: counts, isLoading: isCountsLoading } = useGetAllCountAdminQuery(
		null,
		{ refetchOnFocus: true },
	);
	const isSideBarOpen = useOutletContext();
	if ([!relativeStats, !counts, isStatsLoading, isCountsLoading].every(Boolean))
		return (
			<CircularProgress
				sx={{ position: "absolute", top: "50%", left: "50%" }}
				size="3rem"
				thickness={7}
			/>
		);

	console.log({ isSideBarOpen });

	return (
		<Box m="1.5rem 2.5rem" pb={2}>
			<FlexBetween>
				<Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
				{/* <Box>
					<Button
						sx={{
							bgcolor: theme.palette.secondary.light,
							color: theme.palette.background.alt,
							fontSize: "14px",
							fontWeight: "bold",
							padding: "10px 20px",
						}}>
						<DownloadOutlined sx={{ mr: "10px" }} />
						Download Reports
					</Button>
				</Box> */}
			</FlexBetween>
			<Box
				mt="20px"
				// display="grid"
				display={!isNonSmallScreens && isSideBarOpen ? "none" : "grid"}
				gridTemplateColumns="repeat(12, 1fr)"
				gridAutoRows="160px"
				gap="20px"
				sx={{
					"& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
				}}>
				{/* row1 */}
				<StatBox
					title="Total Users"
					value={counts?.users}
					increase={relativeStats?.relativeUsers * 100}
					description="Since last month"
					icon={
						<Email
							sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
						/>
					}
				/>
				<StatBox
					title="Total Posts"
					value={counts?.posts}
					increase={relativeStats?.relativePosts * 100}
					description="Since last month"
					icon={
						<Book
							sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
						/>
					}
				/>
				<Box
					gridColumn="span 8"
					gridRow="span 2"
					bgcolor={theme.palette.background.alt}
					borderRadius="0.55rem">
					<OverviewChart view="sales" isDashboard={true} />
				</Box>
				<StatBox
					title="Total Trainings"
					value={counts?.trainings}
					increase={relativeStats?.relativeTrainings * 100}
					description="Since last month"
					icon={
						<DirectionsRun
							sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
						/>
					}
				/>
				<StatBox
					title="Total Exercises"
					value={counts?.exercises}
					increase={relativeStats?.relativeExercises * 100}
					description="Since last month"
					icon={
						<FitnessCenter
							sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
						/>
					}
				/>
				{/* row 2 */}
				<Box
					gridColumn="span 8"
					gridRow="span 3"
					// overflow="hidden"
					display={!isNonSmallScreens && isSideBarOpen ? "none" : "block"}>
					<UsersDataGrid height="100%" />
				</Box>
				<Box
					gridColumn="span 4"
					gridRow="span 3"
					bgcolor={theme.palette.background.alt}
					p="1.5rem"
					display={!isNonSmallScreens && isSideBarOpen ? "none" : "block"}
					overflowY="hidden"
					borderRadius="0.55rem">
					<Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
						Numbers of elements
					</Typography>
					<Box overflow="hidden">
						<BreakdownChart isDashboard={true} />
					</Box>
					<Typography
						p="0 0.6rem"
						fontSize="0.8rem"
						sx={{ color: theme.palette.secondary[200] }}>
						Breakdown of real states and information via category for the number
						of total elements.
					</Typography>
				</Box>
			</Box>
		</Box>
	);
};

export default Dashboard;
