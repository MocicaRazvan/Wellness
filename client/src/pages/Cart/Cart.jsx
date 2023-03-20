import {
	alpha,
	Box,
	Button,
	Container,
	Divider,
	styled,
	Typography,
	useTheme,
	useThemeProps,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCartItems } from "../../redux/cart/cartSlice";
import CartList from "../../components/cart/CartList";
import PayButton from "../../components/cart/PayButton";
import { CartItems, CartTotal, StackContainer } from "../../components/reusable/CartWrappers";

const Cart = () => {
	const cartItems = useSelector(selectCartItems);
	const navigate = useNavigate();
	const theme = useTheme();
	const total = cartItems.reduce((acc, cur) => (acc += cur.price), 0);
	if (cartItems?.length === 0) {
		return (
			<Container
				sx={{
					height: "100vh",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					p: 5,
				}}>
				<Box
					bgcolor={theme.palette.background.alt}
					height="50%"
					width={{ xs: "100%", md: "50%" }}
					borderRadius={20}
					p={5}
					display="flex"
					justifyContent="center"
					alignItems="center"
					flexDirection="column"
					gap={10}
					sx={{
						"& button": {
							color: theme.palette.secondary[200],
						},
					}}>
					<Typography
						variant="h2"
						fontWeight="bold"
						color={theme.palette.secondary[300]}>
						Your Cart is Empty
					</Typography>
					<Button
						onClick={() => void navigate("/trainings")}
						variant="contained"
						size="large"
						bgcolor={theme.palette.secondary[200]}>
						Go to trainings
					</Button>
				</Box>
			</Container>
		);
	}
	return (
		<CartItems>
			<StackContainer>
				<CartList cartItems={cartItems} />
			</StackContainer>
			<CartTotal sx={{ position: "sticky", top: 100 }}>
				<Typography component="h3" gutterBottom>
					Cart Summary
				</Typography>
				<Divider sx={{ mb: 2 }} color={theme.palette.secondary[300]} />
				<Container
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						flexDirection: "column",
						gap: 4,
					}}>
					<Container
						sx={{
							display: "flex",
							justifyContent: "space-between",
						}}>
						<Typography component="h4" color={theme.palette.secondary[200]}>
							Total Price
						</Typography>
						<Typography component="h3">${total}</Typography>
					</Container>
					<PayButton cartItems={cartItems} />
				</Container>
			</CartTotal>
		</CartItems>
	);
};
// const CartItems = styled("div")(({ theme }) => ({
// 	p: 2,
// 	display: "flex",
// 	backgroundColor: alpha(theme.palette.primary.main, 0.15),
// 	height: "auto",
// 	padding: "50px 0",
// 	gap: 10,
// 	"& .img": {
// 		width: 200,
// 		height: 200,
// 		marginRight: 20,
// 	},
// 	"& img": {
// 		width: "100%",
// 		height: "100%",
// 		objectFit: "contain",
// 	},
// 	"& h4 span": {
// 		color: theme.palette.secondary.main,
// 		ml: 20,
// 		fontWeight: 500,
// 	},
// 	[theme.breakpoints.down("md")]: {
// 		flexDirection: "column",
// 		justifyContent: "center",
// 		alignItems: "center",
// 	},
// }));

// const StackContainer = styled(Container)(({ theme }) => ({
// 	width: "100%",
// 	display: "flex",
// 	gap: 8,
// 	alignItems: "center",
// 	justifyContent: "space-between",
// 	flexDirection: "column",
// 	[theme.breakpoints.down("sm")]: {
// 		justifyContent: "center",
// 	},
// }));

// const CartTotal = styled("div")(({ theme }) => ({
// 	position: "relative",
// 	borderRadius: "8px",
// 	boxShadow: "rgb(3 0 71 / 9%) 0px 1px 3px",
// 	m: 10,
// 	mt: 30,
// 	ml: 30,
// 	height: "fit-content",
// 	p: 10,
// 	width: "30%",
// 	"& h4": {
// 		fontSize: 15,
// 		fontWeight: 400,
// 	},
// 	"& h3": {
// 		fontSize: 20,
// 		fontWeight: 500,
// 		color: theme.palette.secondary.main,
// 	},
// 	"& h2": {
// 		fontSize: 18,
// 		mt: 20,
// 		//borderBottom: `1px solid ${theme.palette.secondary.light}`,
// 		pb: 10,
// 		color: theme.palette.secondary.main,
// 	},
// 	[theme.breakpoints.down("md")]: {
// 		width: "100%",
// 	},
// }));

export default Cart;
