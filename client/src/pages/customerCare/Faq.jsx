import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Typography,
	useTheme,
} from "@mui/material";

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
	{
		q: "Can I place order over the phone?",
		a: "Our Customer Service team is always on hand to provide support and guidance. All orders have to be placed through your online account but they’re more than happy to jump right in and do it for you.",
	},
	{
		q: "Can I make changes to my cart?",
		a: `Absolutely! Click on the cart icon at the top of the page and you'll be able to see the item(s) you have in there so far. 
		Use the – button if you've selected something that you don't want. If you want to remove the hole cart click on the clear cart button.`,
	},
	{
		q: "Where I can find the Terms And Coditions?",
		a: "Click on the footer in the About Us section on Terms & Conditions.",
	},
	{
		q: "Why am I having probles accessing the checkout?",
		a: "If you're having problems accessing the checkout or any part of our website, then please get in contact with our Customer Service team straight away so we can fix this for you!",
	},
	{
		q: "I have payment problem in my order. What should I do?",
		a: `If you're seeing the status 'Payment Problem' then you're probably confused, don't worry this can be easily fixed and we'll have your products on the way to you in no time!

		Before re-entering any card details you'll need to make sure that the expiry date and billing address are correct. We also recommend checking funds in the account.

		If you've done all that and still can't fix the problem then please contact our Customer Service team who'd be happy to help.`,
	},
	{
		q: "Has my data been transferred to someone else/a third party?",
		a: `It has not been transferred outside the Wellness group. `,
	},
	{
		q: "How to update my password?",
		a: "Just go to your account settings and press the settings icon then resset password.",
	},
	{
		q: "What can I do if i forgot my password?",
		a: "Just go to the login page then press on the forgot password",
	},
	{
		q: "How can I leave a comment?",
		a: "Just create an account and you can write the comments you want, be respectful though.",
	},
	{
		q: "Is your website secure?",
		a: "Yes. The security of your personal information and payment details is of utmost importance to us. We use hash encryption and JWT tokens to help keep all of your data safe.",
	},
];

const Faq = () => {
	const { palette } = useTheme();
	return (
		<Box m="auto 20px" pt={2} px={8} sx={{ borderRadius: "5px" }}>
			<Typography
				color={palette.secondary[400]}
				fontWeight="700"
				fontSize={30}
				gutterBottom
				textAlign="center">
				Frequently Asked Questions
			</Typography>
			{faqArray.map(({ q, a }) => (
				<Accordion key={q} sx={{ bgcolor: palette.background.alt, mb: 2 }}>
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
