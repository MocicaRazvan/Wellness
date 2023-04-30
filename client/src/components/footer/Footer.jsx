import { Facebook, Instagram, Twitter } from "@mui/icons-material";
import { Box, Typography, styled, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCurrentUser } from "../../redux/auth/authSlice";

const Footer = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const user = useSelector(selectCurrentUser);

	return (
		<Box
			marginTop="70px"
			padding="40px 0"
			bgcolor={theme.palette.background.alt}>
			<Box
				width="80%"
				margin="auto"
				display="flex"
				justifyContent="space-between"
				flexWrap="wrap"
				rowGap="30px"
				columnGap="clamp(20px, 30px, 40px)">
				<Box width="clamp(20%, 30%, 40%)">
					<CustomTypography
						variant="h4"
						fontWeight="bold"
						mb="30px"
						color={theme.palette.secondary[400]}>
						Wellness
					</CustomTypography>
					<CustomTypography
						variant="h6"
						color={theme.palette.secondary[200]}
						mb="30px"
						sx={{ wordWrap: "break-word" }}>
						We are a 'family' company that just wants one thing, to make you
						feel better and look better. If you have any problems contact the
						support team and we will asure that they will try their best to help
						you :).
					</CustomTypography>
				</Box>

				<Box>
					<CustomTypography
						variant="h4"
						fontWeight="bold"
						mb="30px"
						color={theme.palette.secondary[400]}>
						About Us
					</CustomTypography>
					<Box
						display="flex"
						alignItems="center"
						justifyContent="space-around"
						mb={2}>
						<Facebook
							sx={{
								fontSize: "30px",
								color: theme.palette.secondary[300],
								cursor: "pointer",
								"& :hover": { color: theme.palette.background.paper },
							}}
							onClick={() => {
								window.open("https://www.facebook.com/", "_blank");
							}}
						/>
						<Instagram
							sx={{
								fontSize: "30px",
								color: theme.palette.secondary[300],
								cursor: "pointer",
								"& :hover": { color: theme.palette.background.paper },
							}}
							onClick={() => {
								window.open("https://www.instagram.com/", "_blank");
							}}
						/>
						<Twitter
							sx={{
								fontSize: "30px",
								color: theme.palette.secondary[300],
								cursor: "pointer",
								"& :hover": { color: theme.palette.background.paper },
							}}
							onClick={() => {
								window.open("https://www.twitter.com/", "_blank");
							}}
						/>
					</Box>
					<CustomTypography
						mb="30px"
						color={theme.palette.secondary[200]}
						sx={{
							cursor: "pointer",
							"&:hover": { color: theme.palette.background.paper },
						}}
						onClick={() => navigate("/about-us/terms-conditions")}>
						Terms & Conditions
					</CustomTypography>
					<CustomTypography
						mb="30px"
						color={theme.palette.secondary[200]}
						sx={{
							cursor: "pointer",
							"&:hover": { color: theme.palette.background.paper },
						}}
						onClick={() => navigate("/about-us/our-story")}>
						Our Story
					</CustomTypography>
				</Box>

				<Box>
					<CustomTypography
						variant="h4"
						fontWeight="bold"
						mb="30px"
						color={theme.palette.secondary[400]}>
						Customer Care
					</CustomTypography>
					<CustomTypography
						mb="30px"
						color={theme.palette.secondary[200]}
						sx={{
							cursor: "pointer",
							"&:hover": { color: theme.palette.background.paper },
						}}
						onClick={() => navigate("/customer-care/faq")}>
						Frequently Asked Questions
					</CustomTypography>
					<CustomTypography
						mb="30px"
						color={theme.palette.secondary[200]}
						sx={{
							cursor: "pointer",
							"&:hover": { color: theme.palette.background.paper },
						}}
						onClick={() => navigate("/customer-care/order-troubleshoot")}>
						Order Troubleshoot
					</CustomTypography>
					<CustomTypography
						mb="30px"
						color={theme.palette.secondary[200]}
						sx={{
							cursor: "pointer",
							"&:hover": { color: theme.palette.background.paper },
						}}
						onClick={() => navigate("/forgotPassword", { state: user?.email })}>
						Forgot Password
					</CustomTypography>
				</Box>

				<Box width="clamp(20%, 25%, 30%)">
					<CustomTypography
						variant="h4"
						fontWeight="bold"
						mb="30px"
						color={theme.palette.secondary[400]}>
						Contact Us
					</CustomTypography>
					<CustomTypography mb="30px" color={theme.palette.secondary[200]}>
						Bld. Iuliu Maniu nr 36
					</CustomTypography>
					<CustomTypography
						mb="30px"
						color={theme.palette.secondary[200]}
						sx={{ wordWrap: "break-word" }}>
						Email: razvanmocica@gmail.com
					</CustomTypography>
					<CustomTypography mb="30px" color={theme.palette.secondary[200]}>
						+40 764 105 200
					</CustomTypography>
				</Box>
			</Box>
		</Box>
	);
};

const CustomTypography = styled(Typography)(({ theme }) => ({
	textAlign: "center",

	[theme.breakpoints.up("md")]: {
		textAlign: "start",
	},
}));

export default Footer;
