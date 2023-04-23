import { Box, Button, Typography, useTheme } from "@mui/material";
import React from "react";
import Lottie from "react-lottie-player";
import { useNavigate } from "react-router-dom";

const LootieCustom = ({
	lootie,
	link,
	replace = false,
	btnText = "",
	title = "",
}) => {
	const theme = useTheme();
	const navigate = useNavigate();
	return (
		<Box
			minHeight="100vh"
			display="flex"
			justifyContent="center"
			alignItems="center"
			mt={5}
			m={2}>
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
						fontSize={{ xs: 15, md: 35 }}
						letterSpacing={1.2}
						color={theme.palette.secondary[300]}
						textAlign="center">
						{title}
					</Typography>
					<Button
						variant="contained"
						onClick={() => navigate(link, { replace })}
						color="secondary">
						{btnText}
					</Button>
				</Box>
				<Box flex="1" display="flex" justifyContent="center">
					<Lottie
						loop
						animationData={lootie}
						play
						style={{ width: "65%", height: "65%", margin: 0, padding: 0 }}
					/>
				</Box>
			</Box>
		</Box>
	);
};

export default LootieCustom;
