import {
	Box,
	Divider,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
	useTheme,
} from "@mui/material";
import {
	SettingsOutlined,
	ChevronLeft,
	ChevronRightOutlined,
	HomeOutlined,
	ShoppingCartOutlined,
	Groups2Outlined,
	ReceiptLongOutlined,
	PublicOutlined,
	PointOfSaleOutlined,
	TodayOutlined,
	CalendarMonthOutlined,
	AdminPanelSettingsOutlined,
	TrendingUpOutlined,
	PieChartOutlined,
	Book,
	Message,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "../reusable/FlexBetween";
import blankUser from "../../images/profile/blank-profile-picture-g212f720fb_640.png";

const navItems = [
	{
		text: "Dashboard",
		icon: <HomeOutlined />,
	},
	{
		text: "Client Facing",
		icon: null,
	},
	{
		text: "Posts",
		icon: <Book />,
	},
	{
		text: "Users",
		icon: <Groups2Outlined />,
	},
	{
		text: "Orders",
		icon: <ReceiptLongOutlined />,
	},
	{
		text: "Geography",
		icon: <PublicOutlined />,
	},
	{
		text: "Sales",
		icon: null,
	},
	{
		text: "Overview",
		icon: <PointOfSaleOutlined />,
	},
	{
		text: "Daily",
		icon: <TodayOutlined />,
	},
	{
		text: "Monthly",
		icon: <CalendarMonthOutlined />,
	},
	{
		text: "Breakdown",
		icon: <PieChartOutlined />,
	},
	{
		text: "Management",
		icon: null,
	},
	{
		text: "Admin",
		icon: <AdminPanelSettingsOutlined />,
	},
	{
		text: "Performance",
		icon: <TrendingUpOutlined />,
	},
];

const Sidebar = ({
	user,
	drawerWidth,
	isSideBarOpen,
	setIsSideBarOpen,
	isNonMobile,
}) => {
	const { pathname } = useLocation();
	const [active, setActive] = useState(""); //what page we are on
	const navigate = useNavigate();
	const theme = useTheme();

	useEffect(() => {
		setActive(pathname.split("/").at(-1));
	}, [pathname]);

	return (
		<Box component="nav">
			{isSideBarOpen && (
				<Drawer
					open={isSideBarOpen}
					onClose={() => setIsSideBarOpen(false)}
					variant="persistent"
					anchor="left"
					sx={{
						width: drawerWidth,
						"& .MuiDrawer-paper": {
							color: theme.palette.secondary[200],
							backgroundColor: theme.palette.background.alt,
							boxSizing: "border-box",
							borderWidth: isNonMobile ? 0 : "2px",
							width: drawerWidth,
						},
					}}>
					<Box width="100%">
						<Box m="1.5rem 2rem 2rem 3rem">
							<FlexBetween colo={theme.palette.secondary.main}>
								<Box display="flex" alignItems="center" gap="0.5rem">
									<Typography variant="h4" fontWeight="bold">
										Wellness
									</Typography>
								</Box>
								{!isNonMobile && (
									<IconButton onClick={() => setIsSideBarOpen((prev) => !prev)}>
										<ChevronLeft />
									</IconButton>
								)}
							</FlexBetween>
						</Box>
						<List>
							{navItems.map(({ text, icon }) => {
								if (!icon) {
									return (
										<Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem" }}>
											{text}
										</Typography>
									);
								} else {
									const lcText = text.toLowerCase();
									return (
										<ListItem key={text} disablePadding>
											<ListItemButton
												onClick={() => {
													navigate(`/admin/${lcText}`);
													setActive(lcText);
												}}
												sx={{
													backgroundColor:
														active === lcText
															? theme.palette.secondary[300]
															: "transparent",
													color:
														active === lcText
															? theme.palette.primary[600]
															: theme.palette.secondary[100],
												}}>
												<ListItemIcon
													sx={{
														ml: "2rem",
														color:
															active === lcText
																? theme.palette.primary[600]
																: theme.palette.secondary[200],
													}}>
													{icon}
												</ListItemIcon>
												<ListItemText primary={text} />
												{active === lcText && (
													<ChevronRightOutlined sx={{ ml: "auto" }} />
												)}
											</ListItemButton>
										</ListItem>
									);
								}
							})}
						</List>
					</Box>
					<Box mb={2}>
						<Divider />
						<FlexBetween textOverflow="none" gap="1rem" m="1.5rem 2rem 0 3rem">
							<Box
								component="img"
								alt="profile"
								src={user?.image?.url || blankUser}
								width="40px"
								height="40px"
								borderRadius="50%"
								sx={{ objectFit: "cover" }}
							/>
							<Box textAlign="left">
								<Typography
									fontWeight="bold"
									fontSize="0.9rem"
									sx={{ color: theme.palette.secondary[100] }}>
									{user?.username}
								</Typography>
								<Typography
									fontSize="0.8rem"
									sx={{ color: theme.palette.secondary[200] }}>
									{user?.occupation}
								</Typography>
							</Box>
							<SettingsOutlined
								sx={{ color: theme.palette.secondary[300], fontSize: "25px" }}
							/>
						</FlexBetween>
					</Box>
				</Drawer>
			)}
		</Box>
	);
};

export default Sidebar;
