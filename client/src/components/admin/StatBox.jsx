import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import FlexBetween from "../reusable/FlexBetween";

const StatBox = ({ title, value, increase, icon, description }) => {
	const theme = useTheme();
	const col =
		increase > 0 ? theme.palette.success.main : theme.palette.error.main;
	return (
		<Box
			gridColumn="span 2"
			gridRow="span 1"
			display="flex"
			flexDirection="column"
			justifyContent="space-between"
			p="1.25rem 1rem"
			flex="1 1 100%"
			bgcolor={theme.palette.background.alt}
			borderRadius="0.55rem">
			<FlexBetween>
				<Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
					{title}
				</Typography>
				{icon}
			</FlexBetween>
			<Typography
				variant="h3"
				fontWeight="600"
				sx={{ color: theme.palette.secondary[200] }}>
				{value}
			</Typography>
			<FlexBetween gap="1rem">
				<Typography variant="h5" fontStyle="italic" sx={{ color: col }}>
					{Math.ceil(increase)}%
				</Typography>
				<Typography sx={{ color: theme.palette.secondary[300] }}>
					{description}
				</Typography>
			</FlexBetween>
		</Box>
	);
};

export default StatBox;
