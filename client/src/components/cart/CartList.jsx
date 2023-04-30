import RemoveIcon from "@mui/icons-material/Remove";
import { Button, IconButton, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/system";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeFormCart } from "../../redux/cart/cartSlice";
import CustomSnack from "../reusable/CustomSnack";

const CartList = ({ cartItems, type = "cart" }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const [cur, setCur] = useState("");
	const theme = useTheme();

	return (
		<>
			<CustomSnack
				open={open}
				setOpen={setOpen}
				message={`${cur} removed from cart`}
				severity="error"
			/>
			{cartItems.map((item) => (
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
							<span>$</span>
							{item?.price}
						</Typography>
					</CartDetails>
					<div>
						{type === "cart" && (
							<RemoveCart
								onClick={() => {
									setOpen(true);
									setCur(item.title);
									dispatch(removeFormCart({ id: item.id }));
								}}>
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
			))}
		</>
	);
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
	"& .img ": {
		"& img": {
			borderRadius: 5,
			objectFit: "cover",
			width: "100%",
			height: "100%",
		},
	},
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
