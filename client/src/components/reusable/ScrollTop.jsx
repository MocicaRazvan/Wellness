import React, { forwardRef } from "react";
import { Box, Zoom, Fab, useTheme, Tooltip } from "@mui/material";
import { KeyboardArrowUp } from "@mui/icons-material";
import useScrollTrigger from "@mui/material/useScrollTrigger";

const ScrollTop = (_, ref) => {
	const trigger = useScrollTrigger({
		disableHysteresis: true,
		threshold: 100,
	});
	const { palette } = useTheme();

	const handleClick = (e) => {
		e.preventDefault();

		const anchor = ref.current;
		if (anchor) {
			console.log(anchor);
			anchor.scrollIntoView({
				block: "start",
			});
		}
	};

	return (
		<Zoom in={trigger}>
			<Box
				onClick={handleClick}
				role="presentation"
				sx={{
					position: "fixed",
					bottom: 16,
					right: 16,
					zIndex: 100,
				}}>
				<Tooltip title="Scroll To Top" arrow>
					<Fab size="small" sx={{ bgcolor: palette.secondary[300] }}>
						<KeyboardArrowUp sx={{ color: palette.background.default }} />
					</Fab>
				</Tooltip>
			</Box>
		</Zoom>
	);
};

export default forwardRef(ScrollTop);
