import { Box, styled, Typography, useTheme } from "@mui/material";
import { Facebook, Instagram, Twitter } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Footer = () => {
	const theme = useTheme();
	const navigate = useNavigate();
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
					{/* <Typography
						variant="h4"
						fontWeight="500"
						sx={{ cursor: "pointer" }}
						onClick={() => navigate("/nft")}
						color={theme.palette.secondary[400]}>
						Feeling like investing in NFT'S? Try out our sister platform!
					</Typography> */}
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
								"& :hover": { color: theme.palette.background.alt },
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
								"& :hover": { color: theme.palette.background.alt },
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
								"& :hover": { color: theme.palette.background.alt },
							}}
							onClick={() => {
								window.open("https://www.twitter.com/", "_blank");
							}}
						/>
					</Box>
					<CustomTypography
						mb="30px"
						color={theme.palette.secondary[200]}
						sx={{ cursor: "pointer" }}>
						Our Achivments
					</CustomTypography>
					<CustomTypography
						mb="30px"
						color={theme.palette.secondary[200]}
						sx={{ cursor: "pointer" }}
						onClick={() => navigate("/about-us/terms-conditions")}>
						Terms & Conditions
					</CustomTypography>
					<CustomTypography
						mb="30px"
						color={theme.palette.secondary[200]}
						sx={{ cursor: "pointer" }}>
						Privacy Policy
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
						sx={{ cursor: "pointer" }}
						onClick={() => navigate("/customer-care/faq")}>
						Frequently Asked Questions
					</CustomTypography>
					<CustomTypography
						mb="30px"
						color={theme.palette.secondary[200]}
						sx={{ cursor: "pointer" }}>
						Track Your Order
					</CustomTypography>
					<CustomTypography
						mb="30px"
						color={theme.palette.secondary[200]}
						sx={{ cursor: "pointer" }}>
						Corporate & Bulk Purchasing
					</CustomTypography>
					<CustomTypography
						mb="30px"
						color={theme.palette.secondary[200]}
						sx={{ cursor: "pointer" }}>
						Returns & Refunds
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
						Str Iuliu Maniu nr36
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
