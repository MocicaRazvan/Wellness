import { Box, Typography, useTheme } from "@mui/material";
import React from "react";

const Header = ({ title, subtitle, small = "false" }) => {
	const theme = useTheme();
	return (
		<Box>
			<Typography
				variant="h2"
				color={theme.palette.secondary[100]}
				fontWeight="bold"
				fontSize={small === "true" ? 20 : 32}
				sx={{ mb: "5px" }}>
				{title}
			</Typography>
			<Typography variant="h5" color={theme.palette.secondary[300]}>
				{subtitle}
			</Typography>
		</Box>
	);
};

export default Header;
