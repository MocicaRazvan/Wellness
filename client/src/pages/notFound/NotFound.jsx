import { Button, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import Lottie from "react-lottie-player";
import { useNavigate } from "react-router-dom";
import PageNotFound from "../../utils/lottie/PageNotFound.json";
const NotFound = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	return (
		<Box
			height="100vh"
			display="flex"
			justifyContent="center"
			alignItems="center"
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
						We can't found the page you are looking for :(
					</Typography>
					<Button
						variant="contained"
						onClick={() => navigate("/", { replace: true })}
						color="secondary">
						Go Home
					</Button>
				</Box>
				<Box flex="1" display="flex" justifyContent="center">
					<Lottie
						loop
						animationData={PageNotFound}
						play
						style={{ width: "65%", height: "65%", margin: 0, padding: 0 }}
					/>
				</Box>
			</Box>
		</Box>
	);
};

export default NotFound;
