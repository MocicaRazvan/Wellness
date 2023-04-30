import { Box, Typography, useTheme } from "@mui/material";
import React from "react";

const textArray = [
	{
		title: "Terms & Conditions",
		body: `These Terms & Conditions associated with the processing of personal data (hereinafter referred to as the Conditions) describe the way in which Welness Ltd., with its registered office at Roamnia, ID number 46 440 224, (hereinafter referred to as the “Company” or “we”) processes your personal data for the purpose of providing our services, consisting in the sale and distribution of nutritional supplements, sportswear and exercise accessories through an online store (hereinafter referred to as the “Services”).

        The company is responsible for the processing of personal data under Regulation (EU) 2016/679 of the European Parliament and of the Council (EU) of 27 April 2016 on the protection of individuals with regard to the processing of personal data and on the free movement of such data, repealing Directive 95/46 / EC ["GDPR". “] and Act no. 18/2018 Coll. on the Protection of Personal Data and on Amendments to Certain Acts, as currently in force [hereinafter referred to as “Act no. 18/2018 Coll. ”].

        The company has taken all appropriate technical and organizational measures to ensure the protection of personal data.

        "Personal data": data relating to an identified natural person or an identifiable natural person which can be identified directly or indirectly, in particular by a generally applicable identifier, another identifier such as a name, surname, identification number, location data or an online identifier, or on the basis of one or more characteristics or traits that make up its physical identity, physiological identity, genetic identity, mental identity, economic identity, cultural identity or social identity.

        "Processing of personal data": a processing operation or set of processing operations involving personal data or personal data files, in particular the acquisition, recording, organizing, structuring, storage, alteration, retrieval, browsing, exploitation, transmission, dissemination or otherwise, combining, restricting, deleting, whether performed by automated means or non-automated means. `,
	},
	{
		title: "ON THE BASIS OF WHAT CAN WE PROCESS YOUR PERSONAL DATA?",
		body: `In addition to the above, we have the right to process your Personal Data to fulfil our legal obligations under Article 6, Sec 1, (c) of the GDPR or to protect our legitimate interests under Article 6 Sec (1), (f) of GDPR, for example for fraud prevention, network and information security and direct marketing.

        We will process your Personal Data in accordance with applicable law, and we will protect your Personal Data against misuse and / or illegal disclosure.`,
	},
	{
		title: "HOW DO WE SHARE YOUR PERSONAL DATA?",
		body: `In order to make our Website and/or Services available (and if necessary due to circumstances) we have the right to provide your Personal Data (and you give consent to such provision) in accordance with the principle of minimization only to a limited circle of persons, our employees, subcontractors, officials, advisors, sales representatives, suppliers or related parties of the Company and the Service Provider to the extent that it is reasonable and necessary to achieve the purpose set out in these Terms&Conditions, in particular the following entities:

        (i) Global Payments Ltd., organizational file, with its registered office at Vajnorská 100 / B, 831 04 Bratislava, Company Identification Number: 50 010 301.

        (ii) Meta Platforms Ireland Limited, 4 Grand Canal Square, Grand Canal Harbour, Dublin, D02X525, Ireland

        (iii) Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland

        (iv) TikTok Inc., Culver City,Bristol Pkwy 5800, United States`,
	},
	{
		title: "DO WE TRANSFER YOUR PERSONAL DATA TO THIRD COUNTRIES?",
		body: `The personal data we collect may be stored or otherwise processed and transmitted within the countries in which we conduct our business activities to achieve the purpose of the processing set forth in these Terms. For the same purpose, your data may be transferred between the Member States of the European Union or the European Economic Area and countries which, according to the European Commission, guarantee the level of personal data protection as published from time to time by the Office for Personal Data Protection on its website: https://dataprotection.gov.sk/uoou/en/content/transfers-basis-adequacy-decision`,
	},
	{
		title: "HOW LONG WILL WE PROCESS YOUR PERSONAL DATA?",
		body: `Unless otherwise provided in applicable law, we have the right to process your Personal Data in a form that allows you to identify yourself for the time necessary to achieve the purpose for which the Personal Data was provided (this may include the time you visit our Website or use our Services and / or for the entire period during which the purpose of processing Personal Data lasts).`,
	},
];

const TermsAndConditions = () => {
	const { palette } = useTheme();
	return (
		<Box
			display="flex"
			alignItems="center"
			flexDirection="column"
			m="auto 20px"
			py={2}
			px={8}
			sx={{ borderRadius: "5px" }}
			bgcolor={palette.background.alt}>
			{[
				textArray.map(({ title, body }) => (
					<Box mb={2} key={title}>
						<Typography
							color={palette.secondary[400]}
							fontWeight="900"
							fontSize={25}
							gutterBottom
							textAlign="start">
							{title}
						</Typography>
						<Typography
							sx={{ whiteSpace: "pre-line" }}
							color={palette.secondary[200]}
							fontWeight="600"
							fontSize={15}
							textAlign="start">
							{body}
						</Typography>
					</Box>
				)),
			]}
		</Box>
	);
};

export default TermsAndConditions;
