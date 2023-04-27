import { Button, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import Lottie from "react-lottie-player";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { updateUser } from "../../redux/auth/authSlice";
import { clearCart, selectCartItems } from "../../redux/cart/cartSlice";
import { useGetSingleUserQuery } from "../../redux/user/userApi";
import checkout from "../../utils/lottie/checkout.json";
import success from "../../utils/lottie/success.json";
import { selectSocket } from "../../redux/socket/socketSlice";
import { useCreateNotificationMutation } from "../../redux/notifications/notificationsApi";
import { useUpdateOrderSessionQuery } from "../../redux/orders/orderApi";
const CheckoutSuccess = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const cartItems = useSelector(selectCartItems);
	const {
		data: user,
		isLoading,
		isError: isUserError,
	} = useGetSingleUserQuery();
	const dispatch = useDispatch();
	const socketRedux = useSelector(selectSocket);
	const [createNotification] = useCreateNotificationMutation();
	const [items, setItems] = useState([]);
	const [searchParams] = useSearchParams();

	const { data, isError } = useUpdateOrderSessionQuery(
		{ session: searchParams.get("session") },
		{ skip: !searchParams.get("session") },
	);

	useEffect(() => {
		if (user && !isLoading) {
			console.log(user);
			dispatch(updateUser({ user }));
		}
	}, [dispatch, isLoading, user]);
	useEffect(() => {
		if (cartItems.length > 0 && user?._id) {
			setItems(cartItems);
			dispatch(clearCart());
		}
	}, [cartItems, cartItems.length, dispatch, user?._id]);
	useEffect(() => {
		if (items?.length > 0 && user?._id && socketRedux && data?.updated) {
			(async () => {
				try {
					await Promise.all(
						items?.map(async ({ id, user: { _id } }) => {
							const ob = {
								receiver: _id,
								type: "training/bought",
								sender: user?._id,
								ref: id,
							};
							socketRedux.emit("notifApproved", {
								...ob,
								receiverId: ob.receiver,
							});
							return await createNotification(ob).unwrap();
						}),
					);
					setItems([]);
				} catch (error) {
					console.log(error);
				}
			})();
		}
	}, [
		items,
		items?.length,
		createNotification,
		dispatch,
		socketRedux,
		user?._id,
		data?.updated,
	]);

	if (isError || isUserError || !searchParams.get("session"))
		navigate("/", { replace: true });

	return (
		<Box
			height="100vh"
			display="flex"
			justifyContent="center"
			alignItems="center">
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				flexDirection="column"
				bgcolor={theme.palette.background.alt}
				p={10}
				borderRadius={5}>
				<Box
					flex="1"
					display="flex"
					justifyContent="center"
					alignItems="center"
					flexDirection="column"
					gap={5}>
					<Typography
						variant="h2"
						fontWeight="bold"
						fontSize={{ xs: 30, md: 40 }}
						letterSpacing={1.2}
						sx={{
							cursor: "pointer",
						}}
						color={theme.palette.secondary[300]}>
						Order Completed!
					</Typography>
					<Typography
						variant="h2"
						fontWeight="bold"
						fontSize={{ xs: 15, md: 20 }}
						letterSpacing={1.2}
						sx={{
							cursor: "pointer",
							"&:hover": {
								color: theme.palette.primary.main,
							},
						}}
						onClick={() => navigate("/orders")}
						color={theme.palette.secondary[300]}>
						Check the your orders page!
					</Typography>
					<Button
						variant="contained"
						onClick={() => navigate("/trainings")}
						color="secondary">
						Continue Shopping
					</Button>
				</Box>
				<Box
					flex="1"
					display="flex"
					justifyContent="center"
					alignItems="center">
					<Lottie
						loop
						animationData={success}
						play
						style={{ width: "50%", height: "50%", margin: 0, padding: 0 }}
					/>
				</Box>
			</Box>
		</Box>
	);
};

export default CheckoutSuccess;
