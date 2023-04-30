import DeleteIcon from "@mui/icons-material/Delete";
import {
	Box,
	Button,
	Container,
	Divider,
	Typography,
	useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartList from "../../components/cart/CartList";
import PayButton from "../../components/cart/PayButton";
import { clearCart, selectCartItems } from "../../redux/cart/cartSlice";

import {
	CartItems,
	CartTotal,
	StackContainer,
} from "../../components/reusable/CartWrappers";
import CustomSnack from "../../components/reusable/CustomSnack";
import LootieCustom from "../../components/reusable/LootieCustom";
import UserAgreement from "../../components/reusable/UserAgreement";
import emptyCart from "../../utils/lottie/emptyCart.json";
const Cart = () => {
	const cartItems = useSelector(selectCartItems);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const theme = useTheme();
	const [open, setOpen] = useState(false);
	const [snackOpen, setSnackOpen] = useState(false);
	const total = cartItems?.reduce((acc, cur) => (acc += cur.price), 0);
	if (cartItems?.length === 0) {
		return (
			<Box sx={{ m: "0 auto", width: "80%", height: "55%" }}>
				<CustomSnack
					open={snackOpen}
					setOpen={setSnackOpen}
					message={`Cart cleared`}
					severity="error"
				/>
				<LootieCustom
					lootie={emptyCart}
					link={"/trainings"}
					btnText="Go Shopping"
					replace={false}
					title="Your cart is empty :("
				/>
			</Box>
		);
	}
	return (
		<CartItems>
			<UserAgreement
				open={open}
				setOpen={setOpen}
				title={"Confirm delete"}
				text={
					"Are you sure you want to empty the cart? We are sure that you will enjoy the trainings."
				}
				handleAgree={() => {
					setSnackOpen(true);
					dispatch(clearCart());
				}}
			/>
			<StackContainer>
				<Box mb={2} display={"flex"} justifyContent="start" width="100%">
					<Button
						sx={{
							bgcolor: theme.palette.secondary[300],
							color: theme.palette.background.default,
							"&:hover": {
								color: theme.palette.secondary[300],
								bgcolor: theme.palette.background.default,
							},
						}}
						onClick={() => setOpen((prev) => !prev)}
						variant="outlined"
						startIcon={<DeleteIcon />}>
						Clear Cart
					</Button>
				</Box>
				<CartList cartItems={cartItems} />
			</StackContainer>
			<CartTotal sx={{ position: "sticky", top: 100, right: 20 }}>
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
						gap: 2,
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
					<Container
						sx={{
							display: "flex",
							justifyContent: "space-between",
						}}>
						<Typography component="h4" color={theme.palette.secondary[200]}>
							Total Items
						</Typography>
						<Typography component="h3">{cartItems?.length}</Typography>
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
