import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import {
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	CardMedia,
	Chip,
	IconButton,
	Stack,
	styled,
	Tooltip,
	Typography,
	useTheme,
} from "@mui/material";
import moment from "moment";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { slideInRight } from "../../animation/animations";
import CustomSnack from "../../components/reusable/CustomSnack";
import blankImage from "../../images/profile/blank-profile-picture-g212f720fb_640.png";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { addToCart, selectCartItems } from "../../redux/cart/cartSlice";

const TrainingCard = ({ item }) => {
	const [showOptions, setShowOptions] = useState(false);
	const theme = useTheme();
	const cartItems = useSelector(selectCartItems);
	const subscriptions = useSelector(selectCurrentUser)?.subscriptions;
	const user = useSelector(selectCurrentUser);
	const isBoughtOrInCart =
		subscriptions?.includes(item?.id) ||
		cartItems?.some(({ id }) => id === item?.id) ||
		item?.user?._id === user?.id;
	const [open, setOpen] = useState(false);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleMouseEnter = (e) => {
		console.log({
			t: e.target,
			c: e.currentTarget.id,
			e: e.target === e.currentTarget.id,
		});
		setShowOptions(true);
	};

	const handleMouseLeave = (e) => {
		console.log({
			t: e.target,
			c: e.currentTarget.id,
			e: e.target === e.currentTarget.id,
		});
		setShowOptions(false);
	};
	const handleViewMore = () => {
		navigate(`/trainings/find/${item.id}`);
	};

	const handleAddTocard = () => {
		if (!user) {
			navigate("/login");
			return;
		}
		setOpen(true);
		dispatch(addToCart(item));
	};

	return (
		<>
			<CustomSnack
				open={open}
				setOpen={setOpen}
				message={`${item?.title} added to cart`}
			/>
			<Card
				id="card"
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				sx={{
					width: { xs: "100%" },
					maxWidth: "500px",
					position: "relative",
					boxShadow: `2px 2px 20px 2px ${theme.palette.background.alt}`,
				}}>
				<Box>
					<CardMedia
						image={item?.images[0]?.url}
						alt={item?.title}
						sx={{ width: { xs: "100%" }, height: 180 }}
					/>
				</Box>
				<CardContent>
					<Box>
						<Typography
							variant="subtitle1"
							fontWeight="bold"
							color={theme.palette.secondary[200]}>
							{item?.title.slice(0, 60)}
						</Typography>
					</Box>
					<Box
						sx={{ mt: 1 }}
						display="flex"
						justifyContent="start"
						alignItems="center"
						flexWrap="wrap">
						<Typography
							sx={{ display: "inline" }}
							color={theme.palette.secondary[200]}>
							Targets:
						</Typography>

						{item?.tags?.map((tag) => (
							<Chip
								key={tag}
								label={tag}
								sx={{ color: theme.palette.secondary[400], ml: 1 }}
							/>
						))}
					</Box>
					<Box sx={{ mt: 1.5 }}>
						<Box
							display="flex"
							justifyContent="space-between"
							alignItems="center">
							{/* <Typography
        variant="subtitle2"
        color={theme.palette.secondary[300]}>
        Made By: {item?.user?.username}
    </Typography> */}
							<Box sx={{ display: "flex" }}>
								<Avatar src={item?.user?.image?.url || blankImage} />
								<Box ml={2}>
									<Tooltip title="Go to profile" arrow placement="top">
										<Typography
											variant="subtitle2"
											component="p"
											sx={{
												cursor: "pointer",
												"&:hover": { color: theme.palette.secondary[300] },
											}}
											color={theme.palette.secondary[100]}
											onClick={() =>
												void navigate("/user/author", {
													state: item?.user?._id,
												})
											}>
											{item?.user?.username}
										</Typography>
									</Tooltip>
									<Typography
										variant="subtitle2"
										color={theme.palette.secondary[100]}
										component="p">
										{moment(item.createdAt).format("YYYY-MM-DD")}
									</Typography>
								</Box>
							</Box>
							<Typography
								variant="subtitle1"
								fontWeight="bold"
								color={theme.palette.secondary[200]}>
								Price: ${item?.price}
							</Typography>
						</Box>
					</Box>
				</CardContent>
				<Box>
					{showOptions && (
						<ProductViewMore
							onClick={handleViewMore}
							onMouseMove={(e) => {
								e.stopPropagation();
							}}
							show={showOptions}
							variant="contained">
							View More
						</ProductViewMore>
					)}
					{!isBoughtOrInCart && (
						<ProductActionsWrapper
							show={showOptions}
							onMouseMove={(e) => {
								e.stopPropagation();
							}}>
							<Stack
								direction="column"
								sx={{
									bgcolor: "rgba(0,0,0,0.75)",
									borderRadius: "50%",
									p: 0.75,
								}}>
								<IconButton
									onClick={handleAddTocard}
									sx={{ color: theme.palette.secondary[500] }}>
									<ShoppingBasketIcon color={theme.palette.secondary[500]} />
								</IconButton>
							</Stack>
						</ProductActionsWrapper>
					)}
				</Box>
			</Card>
		</>
	);
};

export const ProductViewMore = styled(Button, {
	shouldForwardProp: (prop) => prop !== "show",
})(({ show, theme }) => ({
	fontSize: "12px",
	position: "absolute",
	bottom: "2%",
	left: "48%",
	width: "50%",
	padding: "10px 5px",
	animation:
		show &&
		`${slideInRight} 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both`,
	color: theme.palette.secondary[300],
	background: theme.palette.background.alt,
	opacity: 0.9,
}));

export const ProductMetaWrapper = styled(Box)(({ theme }) => ({
	padding: 4,
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
}));

export const ProductActionsWrapper = styled(Box, {
	shouldForwardProp: (prop) => prop !== "show",
})(({ show, theme }) => ({
	display: show ? "visible" : "none",
	position: "absolute",
	right: 0,
	top: "20%",
	animation:
		show &&
		`${slideInRight} 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both`,
}));

export default TrainingCard;
