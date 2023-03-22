import {
	Box,
	Button,
	Card,
	CardContent,
	CardMedia,
	Chip,
	IconButton,
	Stack,
	styled,
	Typography,
	useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { slideInBottom, slideInRight } from "../../animation/animations";
import { useNavigate } from "react-router-dom";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, selectCartItems } from "../../redux/cart/cartSlice";
import { selectCurrentUser } from "../../redux/auth/authSlice";

const TrainingCard = ({ item }) => {
	const [showOptions, setShowOptions] = useState(false);
	const theme = useTheme();
	const cartItems = useSelector(selectCartItems);
	const subscriptions = useSelector(selectCurrentUser)?.subscriptions;
	const user = useSelector(selectCurrentUser);
	const isBoughtOrInCart =
		subscriptions?.includes(item?.id) ||
		cartItems?.some(({ id }) => id === item?.id);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleMouseEnter = () => {
		setShowOptions(true);
	};

	const handleMouseLeave = () => {
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
		dispatch(addToCart(item));
	};

	return (
		<Card
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
				<Box sx={{ m: 1 }}>
					<Typography variant="subtitle2" color={theme.palette.secondary[300]}>
						Made By: {item?.user?.username}
					</Typography>
				</Box>
			</CardContent>
			{showOptions && (
				<ProductViewMore
					onClick={handleViewMore}
					show={showOptions}
					variant="contained">
					View More
				</ProductViewMore>
			)}
			{!isBoughtOrInCart && (
				<ProductActionsWrapper show={showOptions}>
					<Stack direction="column">
						<IconButton
							onClick={handleAddTocard}
							sx={{ color: theme.palette.secondary[500] }}>
							<ShoppingBasketIcon color={theme.palette.secondary[500]} />
						</IconButton>
					</Stack>
				</ProductActionsWrapper>
			)}
		</Card>
	);
};

export const ProductViewMore = styled(Button, {
	shouldForwardProp: (prop) => prop !== "show",
})(({ show, theme }) => ({
	fontSize: "12px",
	position: "absolute",
	bottom: "2%",
	left: "25%",
	width: "50%",
	padding: "10px 5px",
	animation:
		show &&
		`${slideInBottom} 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both`,
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
