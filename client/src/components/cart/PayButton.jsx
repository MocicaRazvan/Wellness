import { alpha, Button, styled } from "@mui/material";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { useCheckoutMutation } from "../../redux/cart/cartApi";

const PayButton = ({ cartItems }) => {
	const userId = useSelector(selectCurrentUser)?.id;
	const [checkout, { isLoading }] = useCheckoutMutation();

	const handleCheckout = async () => {
		try {
			const res = await checkout({ cartItems, userId });
			if (res?.data?.url) {
				window.location.href = res.data.url;
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
