import { useTheme, useMediaQuery, Box, Typography } from "@mui/material";
import Form from "./Form";

const CreatePost = () => {
	const theme = useTheme();
	const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
	return (
		<Box>
			<Box
				width={isNonMobileScreens ? "50%" : "93%"}
				p="2rem"
				m="2rem auto"
				borderRadius="1.5rem"
				bgcolor={theme.palette.background.alt}>
				<Typography
					fontWeight="bold"
					textAlign="center"
					color={theme.palette.secondary[200]}
					letterSpacing={1.5}
					variant="h3"
					sx={{ mb: "1.5rem" }}>
					Create a post from the bottom of your heart
				</Typography>
				<Form />
			</Box>
		</Box>
	);
};

export default CreatePost;
