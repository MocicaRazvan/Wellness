import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import bicepCurl from "../../images/ourStory/bicepCurl.jpg";
import nutrition from "../../images/ourStory/nutrition.jpg";
import yogaGroup from "../../images/ourStory/yogaGroup.jpg";
import React from "react";

const OurStory = () => {
	const isNonMobile = useMediaQuery("(min-width:1000px)");
	const { palette } = useTheme();
	return (
		<Box m={2} p={2}>
			<Box
				display="flex"
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
				gap={4}>
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
					flexDirection={isNonMobile ? "row" : "column"}
					gap={2}
					flex={1}>
					<Box flex={1} p={2}>
						<img
							src={bicepCurl}
							alt=""
							style={{ maxWidth: "100%", height: "auto" }}
						/>
					</Box>
					<Box flex={1} p={2}>
						<Typography
							color={palette.secondary[300]}
							fontSize={isNonMobile ? 35 : 24}
							fontWeight="bold"
							textAlign="center"
							gutterBottom>
							Who we are
						</Typography>
						<Typography
							color={palette.secondary[200]}
							fontSize={isNonMobile ? 22 : 16}
							fontWeight={500}
							textAlign="start">
							We are a small company that aims to help people develop a sense of
							what can be done if you put your mind into it. We are based in
							Romania, but you can enter our platform form every corner of the
							world. Also, our goal is to provide quality information about
							health and sports form various independent trainers that are on
							our platform.
						</Typography>
					</Box>
				</Box>
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
					flexDirection={isNonMobile ? "row" : "column"}
					gap={2}
					flex={1}>
					<Box flex={1} p={2} order={isNonMobile ? 1 : 0}>
						<img
							src={nutrition}
							alt=""
							style={{ maxWidth: "100%", height: "auto" }}
						/>
					</Box>
					<Box flex={1} p={2}>
						<Typography
							color={palette.secondary[300]}
							fontSize={isNonMobile ? 35 : 24}
							fontWeight="bold"
							textAlign="center"
							gutterBottom>
							What we do
						</Typography>
						<Typography
							color={palette.secondary[200]}
							fontSize={isNonMobile ? 22 : 16}
							fontWeight={500}
							textAlign="start">
							At Wellnes, our aim is to fuel the ambitions of people across the
							world — making the best in sports information available to
							everyone, whatever their goal. We pride ourselves in providing a
							broad selection of trainings at exceptional value to power so any
							customer can enjoy the benefits of high-quality nutrition. We get
							the information ourselves , cutting our third-party costs to
							deliver great prices, and guaranteeing the greatest quality. We've
							got a large and growing community too — that's why we share the
							latest and most-important nutritional know-how across our platform
							and social media, with recipes, workouts and everything
							in-between, so that we're supporting our customers at every stage
							in their fitness journey.
						</Typography>
					</Box>
				</Box>
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
					flexDirection={isNonMobile ? "row" : "column"}
					gap={2}
					flex={1}>
					<Box flex={1} p={2}>
						<img
							src={yogaGroup}
							alt=""
							style={{ maxWidth: "100%", height: "auto" }}
						/>
					</Box>
					<Box flex={1} p={2}>
						<Typography
							color={palette.secondary[300]}
							fontSize={isNonMobile ? 35 : 24}
							fontWeight="bold"
							textAlign="center"
							gutterBottom>
							What we want
						</Typography>
						<Typography
							color={palette.secondary[200]}
							fontSize={isNonMobile ? 22 : 16}
							fontWeight={500}
							textAlign="start">
							We want to make everybody to feel weloomed on our platform despite
							their goals. To help us do that don't hesitate to write to us if
							something seems wrong, you can do that via the "Contact support"
							or via the email "razvanmocica@gmail.com". Also, we are always
							looking to expand our team, so if you feel that you got it send us
							a CV via email.
						</Typography>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default OurStory;
