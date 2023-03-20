import { Button, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect } from "react";
import Lottie from "react-lottie-player";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../redux/auth/authSlice";
import { useGetSingleUserQuery } from "../../redux/user/userApi";
import checkout from "../../utils/lottie/checkout.json";
const CheckoutSuccess = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const { data: user, isLoading } = useGetSingleUserQuery();
	const dispatch = useDispatch();

	useEffect(() => {
		if (user && !isLoading) {
			console.log(user);
			dispatch(updateUser({ user }));
		}
	}, [dispatch, isLoading, user]);

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
						fontSize={{ xs: 20, md: 35 }}
						letterSpacing={1.2}
						color={theme.palette.secondary[300]}>
						Your items are on their way!
					</Typography>
					<Button
						variant="contained"
						onClick={() => navigate("/trainings")}
						color="secondary">
						Continue Shopping
					</Button>
				</Box>
				<Box flex="1">
					<Lottie
						loop
						animationData={checkout}
						play
						style={{ width: "100%", height: "100%", margin: 0, padding: 0 }}
					/>
				</Box>
			</Box>
		</Box>
	);
};

export default CheckoutSuccess;
