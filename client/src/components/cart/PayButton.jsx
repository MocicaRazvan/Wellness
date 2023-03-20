import { alpha, Button, styled } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { useCheckoutMutation } from "../../redux/cart/cartApi";
import { clearCart } from "../../redux/cart/cartSlice";

const PayButton = ({ cartItems }) => {
	const userId = useSelector(selectCurrentUser)?.id;
	const [checkout, { isLoading }] = useCheckoutMutation();
	const dispatch = useDispatch();

	const handleCheckout = async () => {
		try {
			const res = await checkout({ cartItems, userId });
			if (res?.data?.url) {
				console.log(res?.data?.url);
				window.location.href = res.data.url;
				dispatch(clearCart());
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<PayBtn variant="contained" size="large" onClick={handleCheckout}>
			ORDER
		</PayBtn>
	);
};

const PayBtn = styled(Button)(({ theme }) => ({
	backgroundColor: alpha(theme.palette.background.alt, 0.7),
	color: theme.palette.secondary[300],
}));

export default PayButton;
