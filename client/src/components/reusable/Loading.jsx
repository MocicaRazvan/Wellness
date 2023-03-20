import { CircularProgress, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const Loading = ({ loading, type = "loading" }) => {
	const { palette } = useTheme();
	return (
		<Box
			zIndex="10"
			position="fixed"
			top="0"
			left="0"
			width="100vw"
			height="100vh"
			display="flex"
			justifyContent="center"
			alignItems="center"
			flexDirection="column"
			gap={2}
			bgcolor="rgba(0,0,0,0.75)"
			sx={{
				transitionProperty: "transform",
				transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
				transitionDuration: "300ms",
				transform: loading?.show ? "scale(1)" : "scale(0)",
			}}>
			{type === "loading" && <CircularProgress />}
			{type === "alert" ? (
				loading?.color === "red" ? (
					<DisabledByDefaultIcon color="error" fontSize="large" />
				) : (
					<CheckBoxIcon color="success" fontSize="large" />
				)
			) : null}

			<Typography color={palette.secondary[200]} variant="body1" fontSize={27}>
				{loading?.msg}
			</Typography>
		</Box>
	);
};

export default Loading;
