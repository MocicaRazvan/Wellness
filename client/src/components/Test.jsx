import {
	Box,
	Button,
	Divider,
	Popover,
	Typography,
	useTheme,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCartItems } from "../redux/cart/cartSlice";

const Test = () => {
	const cartItems = useSelector(selectCartItems);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const total = cartItems?.reduce((acc, cur) => (acc += cur.price), 0);
	const { palette } = useTheme();
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const navigate = useNavigate();

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);

	console.log(cartItems);

	return (
		<div style={{ textAlign: "center" }}>
			<Button variant="contained" onClick={handleClick}>
				Open Popover
			</Button>

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
									p={1}
									width={200}
									display="flex"
									justifyContent="space-between"
									alignItems="center">
									<Typography
										color={palette.secondary[300]}
										fontSize={15}
										fontWeight={900}>
										{title}
									</Typography>
									<Typography color={palette.secondary[300]}>
										${price}
									</Typography>
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
								onClick={() => navigate("/cart")}>
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
						onClick={() => navigate("/trainings")}>
						No itmes, go shopping!
					</Typography>
				)}
			</Popover>
		</div>
	);
};

export default Test;
