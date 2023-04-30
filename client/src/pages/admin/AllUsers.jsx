import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Fade,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import UsersDataGrid from "../../components/admin/UsersDataGrid";
import Header from "../../components/reusable/Header";
import InfoBar from "../../components/statistics/InfoBar";
import TrainerDaily from "../../components/statistics/TrainerDaily";
import TrainerOverview from "../../components/statistics/TrainerOverview";
import Daily from "./Daily";
import Overview from "./Overview";

const AllUsers = () => {
	const isNonMobileScreens = useMediaQuery("(min-width: 1200px)");
	const isSideBarOpen = useOutletContext();
	const [selected, setSelected] = useState(null);
	const isSmall = isNonMobileScreens && !isSideBarOpen;
	const [earningsOpen, setEarningsOpen] = useState(false);
	const [spendingsOpen, setSpendingsOpen] = useState(false);
	const isNonSmallScreens = useMediaQuery("(min-width: 620px)");
	const isClose = !isNonSmallScreens && isSideBarOpen;
	const { palette } = useTheme();

	console.log({ selected });
	useEffect(() => {
		setEarningsOpen(false);
		setSpendingsOpen(false);
	}, [selected]);

	console.log({ selected });
	return (
		<Box
			m="1.5rem 2.5rem"
			pb={2}
			sx={{
				overflowX: "hidden",
				transition: "min-height 1.15s ease-out",
			}}>
			<Header title="Users" subtitle="Manage the users" />
			<Box display={isClose ? "none" : "block"}>
				<Box
					display="flex"
					justifyContent="center"
					// overflow="hidden"
					m="0 auto">
					<Box flex={isSmall ? 0.87 : 1} maxWidth={1300}>
						<UsersDataGrid
							setSelected={setSelected}
							disableSelectionOnClick={false}
						/>
					</Box>
				</Box>

				{selected && (
					<Fade in={selected ? true : false}>
						<Box mt={5}>
							{/* <Typography
								fontSize={{ md: 20, xs: 15 }}
								mb={1}
								ml={1}
								fontWeight="bold"
								textAlign="start"
								color={palette.secondary[300]}>
								{selected?.username}'s Information
							</Typography> */}

							<Accordion
								TransitionProps={{ unmountOnExit: true }}
								expanded={spendingsOpen}
								onChange={(e, isExpanded) => {
									console.log({ isExpanded });
									setSpendingsOpen(isExpanded);
								}}
								sx={{
									bgcolor:
										palette.mode === "dark"
											? palette.primary.dark
											: palette.primary.light,
								}}>
								<AccordionSummary expandIcon={<ExpandMoreIcon />} a>
									<Typography
										fontWeight="bold"
										textAlign="center"
										fontSize={{ md: 20, xs: 15 }}
										color={palette.secondary[300]}>
										{selected?.username}'s Spendings
									</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Box width="100%" height="100%">
										<Box
											width="95%"
											mt={5}
											p={2}
											gap={1}
											display="grid"
											gridTemplateColumns="repeat(2,minmax(0,1fr))"
											sx={{
												"& > div": {
													gridColumn: isNonMobileScreens ? "span 1" : "span 2",
												},
											}}>
											<Box>
												<Overview
													admin={selected?._id}
													title={`${selected?.username}'s Overview`}
													sales="Amount"
													isProfile={true}
													maxYear={moment(selected?.createdAt).year()}
													small="true"
													height="80vh"
													subtitle="Overview of general spendings"
												/>
											</Box>
											<Box>
												<InfoBar
													userId={selected?._id}
													maxYear={moment(selected?.createdAt).year()}
													small="true"
													title={`${selected?.username}'s spendings by month`}
													height="80vh"
												/>
											</Box>
										</Box>
										<Box width="100%" mt={15}>
											<Daily
												admin={selected?._id}
												isProfile={true}
												title={`${selected?.username}'s Daily Spendings`}
												subtitle="Chart of daily  spendings"
												curve="linear"
												small="true"
											/>
										</Box>
									</Box>
								</AccordionDetails>
							</Accordion>
							{selected?.role !== "user" && (
								<Accordion
									TransitionProps={{ unmountOnExit: true }}
									expanded={earningsOpen}
									onChange={(e, isExpanded) => {
										console.log({ isExpanded });
										setEarningsOpen(isExpanded);
									}}
									sx={{
										bgcolor:
											palette.mode === "dark"
												? palette.primary.dark
												: palette.primary.light,
									}}>
									<AccordionSummary expandIcon={<ExpandMoreIcon />} a>
										<Typography
											fontWeight="bold"
											textAlign="center"
											fontSize={{ md: 20, xs: 15 }}
											color={palette.secondary[300]}>
											{selected?.username}'s Earnings
										</Typography>
									</AccordionSummary>
									<AccordionDetails>
										<Box
											display="flex"
											justifyContent="center"
											alignItems="center">
											<Box width="96%" mt={5} p={2} gap={1}>
												<TrainerOverview
													userId={selected?._id}
													maxYear={moment(selected?.createdAt).year()}
													title={`${selected?.username}'s Earnings Overview`}
													subtitle={`Overview of ${selected?.username}'s general revenue and profit.`}
													small="true"
												/>
												<Box mt={15}>
													<TrainerDaily
														userId={selected?._id}
														curve="linear"
														small="true"
														title={`${selected?.username}'s Daily Sales`}
														subtitle={`Chart of your ${selected?.username}'s sales.`}
													/>
												</Box>
											</Box>
										</Box>
									</AccordionDetails>
								</Accordion>
							)}
						</Box>
					</Fade>
				)}
			</Box>
		</Box>
	);
};

export default AllUsers;
