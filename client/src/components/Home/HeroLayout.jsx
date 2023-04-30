import { styled } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

const HeroLayoutRoot = styled("section")(({ theme }) => ({
	color: theme.palette.common.white,
	position: "relative",
	display: "flex",
	alignItems: "center",
	[theme.breakpoints.up("sm")]: {
		height: "80vh",
		minHeight: 500,
		maxHeight: 1300,
	},
}));

const Background = styled(Box)({
	position: "absolute",
	left: 0,
	right: 0,
	top: 0,
	bottom: 0,
	backgroundSize: "cover",
	backgroundRepeat: "no-repeat",
	zIndex: -2,
});

const HeroLayout = ({ sxBackground, children }) => {
	return (
		<HeroLayoutRoot>
			<Container
				sx={{
					mt: 3,
					mb: 14,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}>
				{children}
			</Container>
			<Box
				sx={{
					position: "absolute",
					left: 0,
					right: 0,
					top: 0,
					bottom: 0,
					backgroundColor: "common.black",
					opacity: 0.4,
					zIndex: -1,
				}}
			/>
			<Background sx={sxBackground} />
		</HeroLayoutRoot>
	);
};

export default HeroLayout;
