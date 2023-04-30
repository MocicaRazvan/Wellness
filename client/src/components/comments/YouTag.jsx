import { Chip } from "@mui/material";

const YouTag = () => {
	return (
		<Chip
			label="you"
			variant="filled"
			size="small"
			sx={{
				bgcolor: "custom.moderateBlue",
				color: "neutral.white",
				fontWeight: 500,
				borderRadius: "5px",
			}}
		/>
	);
};

export default YouTag;
