import {
	ArrowDropDownCircleOutlined,
	DarkModeOutlined,
	Home,
	LightModeOutlined,
} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import {
	AppBar,
	Box,
	Button,
	IconButton,
	Menu,
	MenuItem,
	Toolbar,
	Typography,
	useTheme,
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import blankUser from "../../images/profile/blank-profile-picture-g212f720fb_640.png";
import { setMode } from "../../redux/auth/authSlice";
import { setNotReload } from "../../redux/messages/messagesSlice";
import SearchBar from "../Navigation/SearchBar";
import PopupWrapper from "../Popup/PopupWrapper";
import FlexBetween from "../reusable/FlexBetween";

const Navbar = ({ user, setIsSideBarOpen, isSideBarOpen }) => {
	const dispatch = useDispatch();
	const theme = useTheme();
	const { pathname } = useLocation();
	const isSearchOpen = pathname === "/admin/posts";
	const [anchorEl, setAnchorEl] = useState(null);
	const isOpen = Boolean(anchorEl);
	const navigate = useNavigate();

	const handleClick = (event) => setAnchorEl(event.currentTarget);
	const handleClose = () => setAnchorEl(null);

	return (
		<AppBar
			sx={{
				position: "static",
				background: "none",
				boxShadow: "none",
			}}>
			<Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
				{/* left side */}
				<FlexBetween>
					<IconButton onClick={() => void setIsSideBarOpen((prev) => !prev)}>
						{isSideBarOpen ? <CloseIcon /> : <MenuOpenIcon />}
					</IconButton>
					{isSearchOpen && <SearchBar />}
				</FlexBetween>
				{/* right side*/}

				<FlexBetween gap="0.5rem" justifySelf="flex-end">
					<IconButton onClick={() => dispatch(setMode())}>
						{theme.palette.mode === "dark" ? (
							<LightModeOutlined sx={{ fontSize: "25px" }} />
						) : (
							<DarkModeOutlined sx={{ fontSize: "25px" }} />
						)}
					</IconButton>
					<IconButton>
						<PopupWrapper />
					</IconButton>
					<IconButton>
						<Home onClick={() => navigate("/")} sx={{ fontSize: "25px" }} />
					</IconButton>

					<FlexBetween>
						<Button
							onClick={handleClick}
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								textTransform: "none",
								gap: "1rem",
							}}>
							<Box
								component="img"
								alt="profile"
								src={user?.image?.url || blankUser}
								width="32px"
								height="32px"
								borderRadius="50%"
								sx={{ objectFit: "cover" }}
							/>
							<Box textAlign="left">
								<Typography
									fontWeight="bold"
									fontSize="0.85rem"
									sx={{ color: theme.palette.secondary[100] }}>
									{user?.username}
								</Typography>
								<Typography
									fontSize="0.75rem"
									sx={{ color: theme.palette.secondary[200] }}>
									{user?.role}
								</Typography>
							</Box>
							<ArrowDropDownCircleOutlined
								sx={{ color: theme.palette.secondary[300], fontSize: "25px" }}
							/>
						</Button>
						<Menu
							anchorEl={anchorEl}
							open={isOpen}
							onClose={handleClose}
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "center",
							}}>
							<MenuItem onClick={() => navigate("/")}>Go Home</MenuItem>
							<MenuItem
								onClick={() => {
									dispatch(setNotReload(true));
									navigate("/messenger");
								}}>
								Messenger
							</MenuItem>
						</Menu>
					</FlexBetween>
				</FlexBetween>
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
