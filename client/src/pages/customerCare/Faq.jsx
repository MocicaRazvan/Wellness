import {
	Box,
	useTheme,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const faqArray = [
	{
		q: `What is 'regular price' stated by the products?`,
		a: `Regular price refers to the average amount of money for which the product can be bought in other e-shops. Wellness guarantees you only the best prices.`,
	},
	{
		q: `Why am I unable to sign in to my account?`,
		a: `One of the reasons may be that you are entering an incorrect password, or you are registered with different email. If you are unable to sign in to your account, please contact our customer support. `,
	},
	{
		q: `What are the payment options?`,
		a: `Card payment online - You can pay for your order with a card that has online payments enabled. This is a convenient and secure method of cashless payment. We currently accept payment cards VISA, VISA Electron, Maestro and MasterCard.`,
	},
];

const Faq = () => {
	const { palette } = useTheme();
	return (
		<Box m="auto 20px" py={2} px={8} sx={{ borderRadius: "5px" }}>
			{faqArray.map(({ q, a }) => (
				<Accordion key={q} sx={{ bgcolor: palette.background.alt }}>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls="panel1a-content"
						id="panel1a-header">
						<Typography
							color={palette.secondary[400]}
							fontWeight="700"
							fontSize={20}
							gutterBottom
							textAlign="start">
							{q}
						</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Typography
							sx={{ whiteSpace: "pre-line" }}
							color={palette.secondary[200]}
							fontWeight="600"
							fontSize={15}
							textAlign="start">
							{a}
						</Typography>
					</AccordionDetails>
				</Accordion>
			))}
		</Box>
	);
};

export default Faq;
