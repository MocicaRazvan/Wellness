import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import React from "react";

const OrderTroubleshoot = () => {
	const isNonMobile = useMediaQuery("(min-width:1000px)");
	const { palette } = useTheme();
	return (
		<Box m={2} p={2}>
			<Box
				display="flex"
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
				px={4}
				gap={4}>
				<Typography
					color={palette.secondary[300]}
					fontSize={isNonMobile ? 35 : 24}
					fontWeight="bold"
					textAlign="center"
					gutterBottom>
					To start
				</Typography>
				<Typography
					color={palette.secondary[200]}
					fontSize={isNonMobile ? 22 : 16}
					fontWeight={500}
					textAlign="start">
					First of all don't panic if the order it's not showing up istantly.
					Start by making sure your account it is working and it is not a bank
					related problem, if the money were withdraw we suggest to wait at
					least a day before you submit your issue. After one day first of all
					contact us via the chat or the email. According to the data we have we
					can refund the payment or we will redirect you to the stripe support,
					because we don't handle the payments in house, so if stripes says the
					payment it's ok we can't do more, but they will help you.
				</Typography>
				<Typography
					color={palette.secondary[300]}
					fontSize={isNonMobile ? 35 : 24}
					fontWeight="bold"
					textAlign="center"
					gutterBottom>
					How to contact Stripe
				</Typography>
				<Typography
					color={palette.secondary[200]}
					fontSize={isNonMobile ? 22 : 16}
					fontWeight={500}
					sx={{
						cursor: "pointer",
						"&:hover": {
							color: palette.primary.main,
						},
					}}
					textAlign="start"
					onClick={() =>
						window.open("https://stripe.com/en-ro/contact", "_blank")
					}>
					Just click here to go to stripe support!
				</Typography>
			</Box>
		</Box>
	);
};

export default OrderTroubleshoot;
