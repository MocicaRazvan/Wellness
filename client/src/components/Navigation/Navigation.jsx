import { styled, useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
	LightModeOutlined,
	DarkModeOutlined,
	Calculate,
} from "@mui/icons-material";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Avatar,
	Button,
	Divider,
	List,
	ListItem,
	ListItemButton,
	SwipeableDrawer,
	ListItemText,
	useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import IconBtn from "../reusable/IconBtn";
import { useSelector, useDispatch } from "react-redux";
import { logOut, selectCurrentUser, setMode } from "../../redux/auth/authSlice";
import { Stack } from "@mui/system";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../images/logo.svg";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { selectCartItems } from "../../redux/cart/cartSlice";
import SearchBar from "./SearchBar";
import PopupWrapper from "../Popup/PopupWrapper";
import pathnames from "../../utils/consts/searchBarRoutes";
import { useCreateSupportConversationMutation } from "../../redux/conversation/conversationApi";
import { useEffect } from "react";
import { setNotReload } from "../../redux/messages/messagesSlice";

const drawerWidth = 240;

const Navigation = () => {
	const user = useSelector(selectCurrentUser);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const theme = useTheme();
	const cartTotal = useSelector(selectCartItems)?.length;
	const { pathname } = useLocation();
	const isNotUser = user?.role === "trainer" || user?.role === "admin";
	const isAdmin = user?.role === "admin";
	const isSearchBarOpen = pathnames.includes(pathname);
	const isNonMobile = useMediaQuery("(min-width:900px)");
	const isNotLogged = user === null;

	const [direction, setDirection] = useState({
		top: false,
		left: false,
	});
	const [anchorEl, setAnchorEl] = useState(null);
	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
	const [active, setActive] = useState("");
	// const activeValue = pathname.split('') === "messenger" ? "contact support" : pathname;

	const isMenuOpen = Boolean(anchorEl);
	const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
	const [createConv] = useCreateSupportConversationMutation();

	useEffect(() => {
		if (
			!pathname
				.split("/")
				.some((e) => ["posts", "trainings", "orders", "messenger"].includes(e))
		) {
			setActive("");
		}
		// if (pathname.split("/").some((e) => ["messenger"].includes(e))) {
		// 	setActive("messenger");
		// }
	}, [pathname]);

	const toggleDrawer = (anchor, open) => (event) => {
		if (
			event &&
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}

		setDirection({ ...direction, [anchor]: open });
	};

	const handleProfileMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMobileMenuOpen = (event) => {
		setMobileMoreAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		handleMobileMenuClose();
	};

	const handleMobileMenuClose = () => {
		setMobileMoreAnchorEl(null);
	};

	const handleLogout = () => {
		dispatch(logOut());
	};
	const handleCreatePost = () => {
		navigate("/posts/create");
	};
	const handleViewUsersPosts = () => {
		navigate("/posts/user");
	};

	const handleCreateExercises = () => {
		navigate("/exercises/create");
	};

	const handleViewUsersExercises = () => {
		navigate("/exercises/user");
	};

	const handleCreateTraining = () => {
		navigate("/trainings/create");
	};

	const handleViewTrainings = () => void navigate("/trainings/user");

	const handleViewOrders = () => void navigate("/orders");

	const handleSupport = async () => {
		if (!user) {
			navigate("/login");
		} else if (user?.role !== "admin") {
			dispatch(setNotReload(true));

			await createConv({ id: user?.id });
			navigate("/messenger");
		} else if (user?.role === "admin") {
			dispatch(setNotReload(true));

			navigate("/messenger");
		}
	};

	const list = (anchor) => (
		<Box
			sx={{
				width: anchor === "top" || anchor === "bottom" ? "auto" : 250,

				color: `${theme.palette.secondary.main}`,
			}}
			role="presentation"
			onClick={toggleDrawer(anchor, false)}
			onKeyDown={toggleDrawer(anchor, false)}>
			<List sx={{ p: 2 }}>
				<ListItem disablePadding>
					<Accordion
						onClick={(e) => e.stopPropagation()}
						sx={{
							width: "100%",
							color: theme.palette.secondary[200],
						}}>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1a-content"
							id="panel1a-header">
							<Typography>Posts</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<List disablePadding>
								<ListItem disablePadding>
									<ListItemButton onClick={() => navigate("/posts")}>
										<ListItemText primary={"View All Posts"} />
									</ListItemButton>
								</ListItem>
								<ListItem disablePadding>
									<ListItemButton onClick={handleViewUsersPosts}>
										<ListItemText primary={"View Your Posts"} />
									</ListItemButton>
								</ListItem>
								<ListItem disablePadding>
									<ListItemButton onClick={handleCreatePost}>
										<ListItemText primary={"Create Post"} />
									</ListItemButton>
								</ListItem>
							</List>
						</AccordionDetails>
					</Accordion>
				</ListItem>
				<Divider />
				<ListItem disablePadding>
					<Accordion
						onClick={(e) => e.stopPropagation()}
						sx={{
							width: "100%",
							color: theme.palette.secondary[200],
						}}>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1a-content"
							id="panel1a-header">
							<Typography>Exercises</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<List disablePadding>
								<ListItem disablePadding>
									<ListItemButton onClick={handleViewUsersExercises}>
										<ListItemText primary={"View Your Exercises"} />
									</ListItemButton>
								</ListItem>
								<ListItem disablePadding>
									<ListItemButton onClick={handleCreateExercises}>
										<ListItemText primary={"Create Exercise"} />
									</ListItemButton>
								</ListItem>
							</List>
						</AccordionDetails>
					</Accordion>
				</ListItem>
				<Divider />
				<ListItem disablePadding>
					<Accordion
						onClick={(e) => e.stopPropagation()}
						sx={{
							width: "100%",
							color: theme.palette.secondary[200],
						}}>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1a-content"
							id="panel1a-header">
							<Typography>Trainings</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<List disablePadding>
								<ListItem disablePadding>
									<ListItemButton onClick={() => navigate("/trainings")}>
										<ListItemText primary={"View All Trainings"} />
									</ListItemButton>
								</ListItem>
								<ListItem disablePadding>
									<ListItemButton onClick={handleViewTrainings}>
										<ListItemText primary={"View Your Trainings"} />
									</ListItemButton>
								</ListItem>
								<ListItem disablePadding>
									<ListItemButton onClick={() => navigate(`/trainings/bought`)}>
										<ListItemText primary={"View Bought Trainings"} />
									</ListItemButton>
								</ListItem>
								<ListItem disablePadding>
									<ListItemButton onClick={handleCreateTraining}>
										<ListItemText primary={"Create Training"} />
									</ListItemButton>
								</ListItem>
							</List>
						</AccordionDetails>
					</Accordion>
				</ListItem>
				<Divider />
				<ListItem disablePadding>
					<Accordion
						onClick={(e) => e.stopPropagation()}
						sx={{
							width: "100%",
							color: theme.palette.secondary[200],
						}}>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1a-content"
							id="panel1a-header">
							<Typography>Orders</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<List disablePadding>
								<ListItem disablePadding>
									<ListItemButton onClick={handleViewOrders}>
										<ListItemText primary={"View your orders"} />
									</ListItemButton>
								</ListItem>
							</List>
						</AccordionDetails>
					</Accordion>
				</ListItem>
				<Divider />
				{isAdmin && (
					<ListItem onClick={() => navigate("/admin/dashboard")}>
						<ListItemButton
							component="button"
							sx={{ fontWeight: "bold", fontSize: 15 }}>
							Admin Panel
						</ListItemButton>
					</ListItem>
				)}
				{isNotUser && (
					<ListItem onClick={handleSupport}>
						<ListItemButton
							component="button"
							sx={{ fontWeight: "bold", fontSize: 15 }}>
							Contact Support
						</ListItemButton>
					</ListItem>
				)}
			</List>
		</Box>
	);

	const renderMenu = (
		<Menu
			anchorEl={anchorEl}
			anchorOrigin={{
				vertical: "bottom",
				horizontal: "right",
			}}
			keepMounted
			transformOrigin={{
				vertical: "top",
				horizontal: "right",
			}}
			open={isMenuOpen}
			onClose={handleMenuClose}>
			<MenuItem onClick={handleMenuClose}>
				<Typography onClick={() => void navigate("/user/profile")}>
					Profile
				</Typography>
			</MenuItem>

			<MenuItem onClick={handleMenuClose}>
				<Button
					variant="outlined"
					color="inherit"
					disableElevation
					onClick={handleLogout}>
					Logout
				</Button>
			</MenuItem>
		</Menu>
	);
	const renderMobileMenu = (
		<Menu
			anchorEl={mobileMoreAnchorEl}
			anchorOrigin={{
				vertical: "bottom",
				horizontal: "center",
			}}
			keepMounted
			transformOrigin={{
				vertical: "top",
				horizontal: "right",
			}}
			open={isMobileMenuOpen}
			onClose={handleMobileMenuClose}>
			{!isNotUser && (
				<Box display="flex" justifyContent="center" flexDirection="column">
					<MenuItem onClick={handleMenuClose}>
						<Typography
							onClick={() => {
								navigate("/posts");
								setActive("posts");
							}}
							sx={{
								backgroundColor:
									active === "posts"
										? theme.palette.secondary[300]
										: "transparent",
								color:
									active === "posts"
										? theme.palette.primary[600]
										: theme.palette.secondary[200],
								borderRadius: 5,
								cursor: "pointer",
								p: 0.3,
							}}
							variant="h6">
							Posts
						</Typography>
					</MenuItem>
					<MenuItem onClick={handleMenuClose}>
						<Typography
							onClick={() => {
								navigate("/trainings");
								setActive("trainings");
							}}
							sx={{
								backgroundColor:
									active === "trainings"
										? theme.palette.secondary[300]
										: "transparent",
								color:
									active === "trainings"
										? theme.palette.primary[600]
										: theme.palette.secondary[200],
								borderRadius: 5,
								cursor: "pointer",
								p: 0.3,
							}}
							variant="h6">
							Trainings
						</Typography>
					</MenuItem>
					{!isNotLogged && (
						<MenuItem onClick={handleMenuClose}>
							<Typography
								onClick={() => {
									navigate(`/trainings/bought`);
									setActive("bought");
								}}
								sx={{
									backgroundColor:
										active === "bought"
											? theme.palette.secondary[300]
											: "transparent",
									color:
										active === "bought"
											? theme.palette.primary[600]
											: theme.palette.secondary[200],
									borderRadius: 5,
									cursor: "pointer",
									p: 0.3,
								}}
								variant="h6">
								Bought Trainings
							</Typography>
						</MenuItem>
					)}
					{!isNotLogged && (
						<MenuItem onClick={handleMenuClose}>
							<Typography
								onClick={() => {
									navigate("/orders");
									setActive("orders");
								}}
								sx={{
									backgroundColor:
										active === "orders"
											? theme.palette.secondary[300]
											: "transparent",
									color:
										active === "orders"
											? theme.palette.primary[600]
											: theme.palette.secondary[200],
									borderRadius: 5,
									cursor: "pointer",
									p: 0.3,
								}}
								variant="h6">
								Orders
							</Typography>
						</MenuItem>
					)}
					{!isNotLogged && (
						<MenuItem onClick={handleMenuClose}>
							<Typography
								onClick={() => {
									handleSupport();
									setActive("messenger");
								}}
								sx={{
									backgroundColor:
										active === "messenger"
											? theme.palette.secondary[300]
											: "transparent",
									color:
										active === "messenger"
											? theme.palette.primary[600]
											: theme.palette.secondary[200],
									borderRadius: 5,
									cursor: "pointer",
									p: 0.3,
								}}
								variant="h6">
								Contact Support
							</Typography>
						</MenuItem>
					)}
				</Box>
			)}
			<MenuItem>
				<IconButton onClick={() => dispatch(setMode())}>
					{theme.palette.mode === "dark" ? (
						<DarkModeOutlined sx={{ fontSize: "25px" }} />
					) : (
						<LightModeOutlined sx={{ fontSize: "25px" }} />
					)}
				</IconButton>
			</MenuItem>
			<MenuItem onClick={handleProfileMenuOpen}>
				<IconBtn
					badgeContent={cartTotal}
					icon={<ShoppingCartIcon />}
					onClick={() => void navigate("/cart")}
				/>
			</MenuItem>
			<MenuItem onClick={handleProfileMenuOpen}>
				<PopupWrapper />
			</MenuItem>
			<MenuItem onClick={handleProfileMenuOpen}>
				<IconButton onClick={() => navigate("/calculator")}>
					<Calculate sx={{ fontSize: "25px" }} />
				</IconButton>
			</MenuItem>
			<MenuItem onClick={handleProfileMenuOpen}>
				<Button
					variant="outlined"
					color="inherit"
					disableElevation
					onClick={handleLogout}>
					Logout
				</Button>
			</MenuItem>
		</Menu>
	);

	return (
		<Box
			sx={{
				flexGrow: 1,
				position: "fixed",
				width: "100%",
				top: 0,
				zIndex: 10,
				bgcolor: theme.palette.background.default,
			}}>
			<StyledAppBar
				position="static"
				sx={{ bgcolor: theme.palette.background.default }}>
				<Toolbar>
					{isNotUser && (
						<>
							<IconButton
								color="inherit"
								aria-label="open drawer"
								onClick={toggleDrawer("left", true)}
								edge="start"
								sx={{
									display: { xs: "none", md: "inline" },
									mr: 2,
									...(direction.left && { display: "none" }),
								}}>
								<MenuIcon />
							</IconButton>
							<IconButton
								color="inherit"
								aria-label="open drawer"
								onClick={toggleDrawer("top", true)}
								edge="start"
								sx={{
									display: { xs: "inline", md: "none" },
									mr: 2,
									...(direction.top && { display: "none" }),
								}}>
								<MenuIcon />
							</IconButton>
						</>
					)}
					<Link to="/">
						<img
							alt="LOGO"
							src={logo}
							style={{ width: 50, height: 50, objectFit: "contain" }}
						/>
					</Link>
					{isSearchBarOpen && <SearchBar />}
					{!isNotUser && (
						<Box
							display={isNonMobile ? "flex" : "none"}
							justifyContent="flex-end"
							alignItems="center"
							mr={10}
							gap={5}
							width="100%">
							<Typography
								onClick={() => {
									navigate("/posts");
									setActive("posts");
								}}
								sx={{
									backgroundColor:
										active === "posts"
											? theme.palette.secondary[300]
											: "transparent",
									color:
										active === "posts"
											? theme.palette.primary[600]
											: theme.palette.secondary[200],
									borderRadius: 5,
									cursor: "pointer",
									p: 0.3,
								}}
								variant="h6">
								Posts
							</Typography>
							<Typography
								onClick={() => {
									navigate("/trainings");
									setActive("trainings");
								}}
								sx={{
									backgroundColor:
										active === "trainings"
											? theme.palette.secondary[300]
											: "transparent",
									color:
										active === "trainings"
											? theme.palette.primary[600]
											: theme.palette.secondary[200],
									borderRadius: 5,
									cursor: "pointer",
									p: 0.3,
								}}
								variant="h6">
								Trainings
							</Typography>
							{!isNotLogged && (
								<Typography
									onClick={() => {
										navigate(`/trainings/bought`);
										setActive("bought");
									}}
									sx={{
										backgroundColor:
											active === "bought"
												? theme.palette.secondary[300]
												: "transparent",
										color:
											active === "bought"
												? theme.palette.primary[600]
												: theme.palette.secondary[200],
										borderRadius: 5,
										cursor: "pointer",
										p: 0.3,
									}}
									variant="h6">
									Bought Trainings
								</Typography>
							)}
							{!isNotLogged && (
								<Typography
									onClick={() => {
										navigate("/orders");
										setActive("orders");
									}}
									sx={{
										backgroundColor:
											active === "orders"
												? theme.palette.secondary[300]
												: "transparent",
										color:
											active === "orders"
												? theme.palette.primary[600]
												: theme.palette.secondary[200],
										borderRadius: 5,
										cursor: "pointer",
										p: 0.3,
									}}
									variant="h6">
									Orders
								</Typography>
							)}
							{!isNotLogged && (
								<Typography
									onClick={() => {
										handleSupport();
										setActive("messenger");
									}}
									sx={{
										backgroundColor:
											active === "messenger"
												? theme.palette.secondary[300]
												: "transparent",
										color:
											active === "messenger"
												? theme.palette.primary[600]
												: theme.palette.secondary[200],
										borderRadius: 5,
										cursor: "pointer",
										p: 0.3,
									}}
									variant="h6">
									Contact Support
								</Typography>
							)}
						</Box>
					)}
					<Box sx={{ flexGrow: 1 }} />
					{user ? (
						<>
							<Box
								sx={{
									display: { xs: "none", md: "flex" },
									alignItems: "center",
								}}>
								<IconButton onClick={() => dispatch(setMode())}>
									{theme.palette.mode === "dark" ? (
										<DarkModeOutlined sx={{ fontSize: "25px" }} />
									) : (
										<LightModeOutlined sx={{ fontSize: "25px" }} />
									)}
								</IconButton>
								<IconBtn
									badgeContent={cartTotal}
									icon={<ShoppingCartIcon />}
									onClick={() => void navigate("/cart")}
								/>
								<IconButton onClick={() => navigate("/calculator")}>
									<Calculate sx={{ fontSize: "25px" }} />
								</IconButton>

								<PopupWrapper />
								<IconButton
									size="large"
									edge="end"
									onClick={handleProfileMenuOpen}
									color="inherit">
									{/* <AccountCircle /> */}

									<Avatar src={user?.image?.url} />
								</IconButton>
							</Box>
							<Box sx={{ display: { xs: "flex", md: "none" } }}>
								<IconButton
									size="large"
									onClick={handleMobileMenuOpen}
									color="inherit">
									<MoreIcon />
								</IconButton>
							</Box>
						</>
					) : (
						<>
							<Stack spacing={2} direction="row">
								<Button
									variant="outlined"
									sx={{ border: `1px solid ${theme.palette.secondary[200]}` }}
									disableElevation>
									<Typography
										color={theme.palette.secondary[200]}
										variant="h6"
										onClick={() => {
											navigate("/login");
											//reload
											// navigate(0);
										}}>
										Login
									</Typography>
								</Button>
								<Button
									variant="outlined"
									sx={{ border: `1px solid ${theme.palette.secondary[200]}` }}
									disableElevation>
									<Typography
										color={theme.palette.secondary[200]}
										variant="h6"
										onClick={() => {
											navigate("/register");
											//reload
											// navigate(0);
										}}>
										Register
									</Typography>
								</Button>
							</Stack>
						</>
					)}
				</Toolbar>
			</StyledAppBar>
			{renderMenu}
			{renderMobileMenu}
			{isNotUser && (
				<SwipeableDrawer
					sx={{
						display: {
							xs: "none",
							md: "initial",
						},
					}}
					anchor={"left"}
					open={direction["left"]}
					onClose={toggleDrawer("left", false)}
					onOpen={toggleDrawer("left", true)}>
					{list("left")}
				</SwipeableDrawer>
			)}
			{isNotUser && (
				<SwipeableDrawer
					sx={{ display: { xs: "initial", md: "none" } }}
					anchor={"top"}
					open={direction["top"]}
					onClose={toggleDrawer("top", false)}
					onOpen={toggleDrawer("top", true)}>
					{list("top")}
				</SwipeableDrawer>
			)}
		</Box>
	);
};

const StyledAppBar = styled(AppBar, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	transition: theme.transitions.create(["margin", "width"], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: `${drawerWidth}px`,
		transition: theme.transitions.create(["margin", "width"], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

export default Navigation;
