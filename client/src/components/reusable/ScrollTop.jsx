import { KeyboardArrowUp } from "@mui/icons-material";
import { Box, Fab, Zoom, useTheme } from "@mui/material";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import React, { forwardRef } from "react";

const ScrollTop = () => {
	const trigger = useScrollTrigger({
		disableHysteresis: true,
		threshold: 100,
	});
	const { palette } = useTheme();

	const handleClick = (e) => {
		e.preventDefault();

		window.scrollTo(0, 0);
	};

	return (
		<Zoom in={trigger}>
			{/* <Tooltip title="Scroll To Top" arrow> */}
			<Box
				onClick={handleClick}
				role="presentation"
				sx={{
					position: "fixed",
					bottom: 16,
					right: 16,
					zIndex: 100,
				}}>
				<Fab size="small" sx={{ bgcolor: palette.secondary[300] }}>
					<KeyboardArrowUp sx={{ color: palette.background.default }} />
				</Fab>
			</Box>
			{/* </Tooltip> */}
		</Zoom>
	);
};

export default forwardRef(ScrollTop);
