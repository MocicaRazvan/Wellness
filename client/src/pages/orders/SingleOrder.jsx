import { useTheme } from "@emotion/react";
import { Box, Divider, Typography } from "@mui/material";
import { Container } from "@mui/system";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CartList from "../../components/cart/CartList";
import {
	CartItems,
	CartTotal,
	StackContainer,
} from "../../components/reusable/CartWrappers";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { useGetTrainingsByOrderQuery } from "../../redux/trainings/trainingsApi";

const SingleOrder = () => {
	const { orderId } = useParams();
	const { data, isLoading } = useGetTrainingsByOrderQuery({
		orderId,
	});
	const theme = useTheme();
	const user = useSelector(selectCurrentUser);
	const navigate = useNavigate();
	if (!data || isLoading) return <></>;
	if (user.role !== "admin" && user.id !== data?.user) {
		navigate("/", { replace: true });
	}
	return (
		<CartItems>
			<StackContainer>
				<CartList cartItems={data?.trainings} type="order" />
			</StackContainer>
			<CartTotal sx={{ position: "sticky", top: 100 }}>
				<Typography component="h3" gutterBottom>
					Order Summary
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
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								flexDirection: "column",
								gap: 0.2,
							}}>
							<Typography component="h4" color={theme.palette.secondary[200]}>
								Total Price
							</Typography>
							<Typography component="h3">${data?.total}</Typography>
						</Box>
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								flexDirection: "column",
								gap: 0.2,
							}}>
							<Typography component="h4" color={theme.palette.secondary[200]}>
								Total trainings
							</Typography>
							<Typography component="h3">{data?.trainings?.length}</Typography>
						</Box>
					</Container>
				</Container>
			</CartTotal>
		</CartItems>
	);
};

export default SingleOrder;
