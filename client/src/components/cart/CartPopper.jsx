import {
	Button,
	Divider,
	IconButton,
	Popover,
	Typography,
	useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeFormCart, selectCartItems } from "../../redux/cart/cartSlice";
import RemoveIcon from "@mui/icons-material/Remove";

const CartPopper = ({ setAnchorEl, anchorEl }) => {
	const cartItems = useSelector(selectCartItems);
	const total = cartItems?.reduce((acc, cur) => (acc += cur.price), 0);
	const { palette } = useTheme();
	const dispatch = useDispatch();

	const navigate = useNavigate();

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);

	console.log(cartItems);

	return (
		<div>
			<Popover
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "center",
				}}>
				{cartItems?.length > 0 ? (
					<Box p={1}>
						{cartItems?.map(({ id, title, price }, i) => (
							<Box key={id}>
								<Box
									pl={1}
									py={1}
									width={200}
									gap={1}
									display="flex"
									justifyContent="space-between"
									alignItems="center">
									<Typography
										color={palette.secondary[300]}
										fontSize={15}
										fontWeight={900}
										sx={{ cursor: "pointer" }}
										onClick={() => {
											navigate(`/trainings/find/${id}`);
											handleClose();
										}}>
										{title}
									</Typography>
									<Box
										display="flex"
										justifyContent="end"
										alignItems="center"
										gap={1}>
										<Typography color={palette.secondary[300]}>
											${price}
										</Typography>
										<Box onClick={() => void dispatch(removeFormCart({ id }))}>
											<IconButton>
												<RemoveIcon sx={{ color: palette.secondary[300] }} />
											</IconButton>
										</Box>
									</Box>
								</Box>
								<Divider />
							</Box>
						))}
						<Box
							p={1}
							mt={1}
							width={200}
							display="flex"
							justifyContent="space-between"
							alignItems="center">
							<Button
								sx={{
									bgcolor: palette.secondary[300],
									color: palette.background.default,
									"&:hover": {
										color: palette.secondary[300],
										bgcolor: palette.background.default,
									},
								}}
								size="medium"
								variant="contained"
								onClick={() => {
									navigate("/cart");
									handleClose();
								}}>
								BUY
							</Button>
							<Typography
								color={palette.secondary[300]}
								fontSize={17}
								textAlign="center"
								fontWeight={900}>
								${total}
							</Typography>
						</Box>
					</Box>
				) : (
					<Typography
						color={palette.secondary[300]}
						fontSize={17}
						textAlign="center"
						sx={{ p: 1, cursor: "pointer" }}
						fontWeight={900}
						onClick={() => {
							navigate("/trainings");
							handleClose();
						}}>
						No itmes, go shopping!
					</Typography>
				)}
			</Popover>
		</div>
	);
};

export default CartPopper;
