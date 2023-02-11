import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { useParams } from "react-router-dom";
import CustomCarousel from "../../components/reusable/CustomCarousel";
import { useGetSingleTrainingQuery } from "../../redux/trainings/trainingsApi";
import Carousel from "react-material-ui-carousel";
import CustomVideoCarousel from "../../components/reusable/CustomVideoCarousel";

const SingleTraining = () => {
	const { trainingId } = useParams();
	const theme = useTheme();
	const { data: training, isLoading } = useGetSingleTrainingQuery({
		id: trainingId,
	});

	if (isLoading || !training)
		return (
			<CircularProgress
				sx={{ position: "absolute", top: "50%", left: "50%" }}
				size="3rem"
				thickness={7}
			/>
		);

	const images = training?.images?.map(({ url }) => url);
	console.log(training);

	return (
		<Box m="1.5rem 1rem" position="relative">
			<Typography
				sx={{
					position: "absolute",
					top: 0,
					left: 0,
					width: { xs: 30, md: 200 },
					color: theme.palette.secondary[200],
				}}
				variant="h6"
				fontWeight="600">
				Liked by {training?.likes?.length} people
			</Typography>
			<Typography
				variant="h2"
				color={theme.palette.secondary[200]}
				fontWeight="600"
				textAlign="center"
				gutterBottom>
				{training?.title}
			</Typography>
			<Box
				mt={4}
				p={2}
				mb={4}
				display="flex"
				alignItems="center"
				justifyContent="center"
				flexDirection="column"
				gap={2}>
				<CustomCarousel images={images} height={{ xs: 300, md: 500 }} />
				<Typography
					variant="h4"
					lineHeight={1.5}
					color={theme.palette.secondary[100]}
					width={{ xs: "100%", md: "50%" }}
					textAlign="center"
					dangerouslySetInnerHTML={{ __html: training?.description }}
				/>
			</Box>
			<Typography
				variant="h2"
				color={theme.palette.secondary[400]}
				fontWeight="600"
				textAlign="center"
				gutterBottom>
				Exercises in the training
			</Typography>
			<Box p={2}>
				<Carousel
					animation="fade"
					navButtonsAlwaysVisible
					autoPlay={false}
					interval={6000}>
					{training?.exercises?.map((exercise) => {
						const urls = exercise?.videos?.map(({ url }) => url);
						return (
							<Box>
								<Typography
									variant="h2"
									color={theme.palette.secondary[200]}
									fontWeight="600"
									textAlign="center"
									gutterBottom>
									{exercise?.title}
								</Typography>
								<Box mb={4}>
									<CustomVideoCarousel videos={urls} height={500} />
								</Box>
								<Box p="1rem" display="flex" justifyContent="center">
									<Typography
										variant="h4"
										lineHeight={1.5}
										color={theme.palette.secondary[100]}
										width={{ xs: "100%", md: "50%" }}
										textAlign="center"
										dangerouslySetInnerHTML={{ __html: exercise?.body }}
									/>
								</Box>
							</Box>
						);
					})}
				</Carousel>
			</Box>
		</Box>
	);
};

export default SingleTraining;
