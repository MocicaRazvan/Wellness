import { Box, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { useGetUserByIdQuery } from "../../redux/user/userApi";
import UserInfo from "./UserInfo";

const AutorProfile = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
	const curUser = useSelector(selectCurrentUser);
	const { palette } = useTheme();

	const { data: user, isError } = useGetUserByIdQuery(
		{ id: location?.state },
		{ skip: !curUser?.id },
	);

	if (isError) navigate("/", { replace: true });

	useEffect(() => {
		if (curUser?.id === location.state) {
			navigate("/user/profile", { replace: true });
		}
	}, [location.state, navigate, curUser?.id]);
	if (!curUser) return;

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
			{/* {curUser?.role === "admin" && (
				<>
					<Typography
						fontSize={{ md: 40, xs: 30 }}
						mt={6}
						fontWeight="bold"
						textAlign="center"
						sx={{ textDecoration: "underline" }}
						color={palette.secondary[300]}>
						User Spendings
					</Typography>
					<Box
						width="100%"
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
						<Box width="100%">
							<Overview
								admin={user?.id}
								subtitle="Spendings Overview"
								sales="Amount"
								isProfile={true}
							/>
						</Box>
						<Box width="100%">
							<InfoBar userId={user?.id} />
						</Box>
					</Box>
					<Box width="100%">
						<Daily
							admin={user?.id}
							isProfile={true}
							title="Daily Spendings"
							subtitle="Chart of daily spendings"
						/>
					</Box>
					{user?.role !== "user" && (
						<>
							<Typography
								fontSize={{ md: 40, xs: 30 }}
								mt={12}
								fontWeight="bold"
								textAlign="center"
								sx={{ textDecoration: "underline" }}
								color={palette.secondary[300]}>
								User Earnings
							</Typography>
							<Box width="100%" mt={5} p={2} gap={1}>
								<TrainerOverview userId={user?.id} />
								<Box mt={15}>
									<TrainerDaily userId={user?.id} />
								</Box>
							</Box>
						</>
					)}
				</>
			)} */}
		</Box>
	);
};

export default AutorProfile;
