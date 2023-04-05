import {
	Box,
	CircularProgress,
	Divider,
	Menu,
	MenuItem,
	Typography,
	useTheme,
} from "@mui/material";
import FlexBetween from "../../components/reusable/FlexBetween";
import UserImage from "../../components/reusable/UserImage";
import {
	ManageAccountsOutlined,
	LocationOnOutlined,
	WorkOutlineOutlined,
} from "@mui/icons-material";
import { useGetCountStatsQuery } from "../../redux/user/userApi";
import blankUser from "../../images/profile/blank-profile-picture-g212f720fb_640.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//username, email, role, subscription, image, location, occupation, phonenumber
//tbd update user function
const UserInfo = ({ user, width = "50%" }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const theme = useTheme();
	const { data, isLoading } = useGetCountStatsQuery(null, {
		refetchOnMountOrArgChange: true,
	});
	const navigate = useNavigate();
	const open = Boolean(anchorEl);
	const isAbove = user?.role === "trainer" || user?.role === "admin";

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	if (isLoading || !data)
		return (
			<CircularProgress
				sx={{ position: "absolute", top: "50%", left: "50%" }}
				size="3rem"
				thickness={7}
			/>
		);

	return (
		<Box
			sx={{
				padding: "1.5rem 1.5rem 0.75rem 1.5rem",
				bgcolor: theme.palette.background.alt,
				borderRadius: "0.75rem",
				width,
			}}>
			<FlexBetween gap="0.5rem" pb="1.1rem">
				<FlexBetween gap="1rem">
					<UserImage image={user?.image?.url || blankUser} />
					<Box>
						<Typography
							variant="h4"
							color={theme.palette.secondary[300]}
							fontWeight="500"
							sx={{
								"&:hover": {
									color: theme.palette.primary.light,
									cursor: "pointer",
								},
							}}>
							{user.username}
						</Typography>
						<Typography color={theme.palette.secondary[200]}>
							{user.email}
						</Typography>
					</Box>
				</FlexBetween>
				<ManageAccountsOutlined
					onClick={handleClick}
					sx={{ cursor: "pointer", color: theme.palette.secondary[400] }}
				/>
				<Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
					<MenuItem
						onClick={() => {
							navigate("/forgotPassword", { state: user?.email });
							handleClose();
						}}>
						Forgot password?
					</MenuItem>
					<MenuItem
						onClick={() => {
							handleClose();
							navigate("/user/update", { state: user });
						}}>
						Update Account
					</MenuItem>
					<MenuItem
						onClick={() => {
							handleClose();
							navigate("/orders");
						}}>
						Track your orders
					</MenuItem>
				</Menu>
			</FlexBetween>
			<Divider />
			{/* second row */}
			<Box p="1rem 0">
				<Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
					<LocationOnOutlined
						fontSize="large"
						sx={{ color: theme.palette.secondary[400] }}
					/>
					<Typography color={theme.palette.secondary[200]}>
						{user.location || "No location added"}
					</Typography>
				</Box>
				<Box display="flex" alignItems="center" gap="1rem">
					<WorkOutlineOutlined
						fontSize="large"
						sx={{ color: theme.palette.secondary[400] }}
					/>
					<Typography color={theme.palette.secondary[200]}>
						{user.occupation || "No occupation added"}
					</Typography>
				</Box>
			</Box>
			<Divider />
			{/* third row */}
			<Box p="1rem 0">
				<FlexBetween mb="0.5rem">
					<Typography color={theme.palette.secondary[200]}>
						How many comments you have left
					</Typography>
					<Typography color={theme.palette.secondary[300]} fontWeight="500">
						{data?.comments}
					</Typography>
				</FlexBetween>
				{isAbove && (
					<>
						<FlexBetween mb="0.5rem">
							<Typography color={theme.palette.secondary[200]}>
								How many posts you have created
							</Typography>
							<Typography color={theme.palette.secondary[300]} fontWeight="500">
								{data?.posts}
							</Typography>
						</FlexBetween>
						<FlexBetween mb="0.5rem">
							<Typography color={theme.palette.secondary[200]}>
								How many exercises you have created
							</Typography>
							<Typography color={theme.palette.secondary[300]} fontWeight="500">
								{data?.exercises}
							</Typography>
						</FlexBetween>
						<FlexBetween mb="0.5rem">
							<Typography color={theme.palette.secondary[200]}>
								How many trainings you have created
							</Typography>
							<Typography color={theme.palette.secondary[300]} fontWeight="500">
								{data?.trainings}
							</Typography>
						</FlexBetween>
					</>
				)}
			</Box>
		</Box>
	);
};

export default UserInfo;
