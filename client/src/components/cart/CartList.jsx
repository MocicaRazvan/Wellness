import { Button, IconButton, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/system";
import RemoveIcon from "@mui/icons-material/Remove";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeFormCart } from "../../redux/cart/cartSlice";

const CartList = ({ cartItems, type = "cart" }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const theme = useTheme();

	return cartItems.map((item) => (
		<CartItem key={item.id}>
			<div className="img">
				<img src={item?.images[0].url} alt={item.title} />
			</div>
			<CartDetails>
				<Typography
					component="h3"
					color={theme.palette.secondary[300]}
					fontWeight="bold">
					{item?.title}
				</Typography>
				<Typography component="h4" color={theme.palette.secondary[200]}>
					{item?.price}
					<span>$</span>
				</Typography>
			</CartDetails>
			<div>
				{type === "cart" && (
					<RemoveCart
						onClick={() => void dispatch(removeFormCart({ id: item.id }))}>
						<IconButton>
							<RemoveIcon />
						</IconButton>
					</RemoveCart>
				)}
			</div>
			<CartControl>
				<Button
					color="secondary"
					onClick={() => navigate(`/trainings/find/${item?.id}`)}>
					View More
				</Button>
			</CartControl>
		</CartItem>
	));
};
const CartItem = styled("div")(({ theme }) => ({
	width: "100%",
	flex: 1,
	mt: 30,
	padding: "20px",
	display: "flex",
	position: "relative",
	justifyContent: "space-between",
	backgroundColor: theme.palette.background.alt,
	borderRadius: 20,
	boxShadow: "rgb(3 0 71 / 9%) 0px 1px 3px",
}));

const CartDetails = styled("div")(({ theme }) => ({
	width: "70%",
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-between",
	"& h3": {
		fontSize: 20,
		fontWeight: 500,
		mt: 15,
	},
	"& h4": {
		fontSize: 15,
		fontWeight: 400,
		mt: 30,
		color: theme.palette.secondary.main,
	},
}));

const RemoveCart = styled("div")(({ theme }) => ({
	background: "none",
	fontSize: 25,
	textAlign: "right",
	mr: 10,
}));

const CartControl = styled("div")(({ theme }) => ({
	display: "flex",
	justifyContent: "space-between",
	mt: 40,
	"& button": {
		width: 40,
		height: 40,
		m: 10,
		borderRadius: 5,
	},
}));

export default CartList;
