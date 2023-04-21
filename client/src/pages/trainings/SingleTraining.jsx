import {
	Box,
	Button,
	CircularProgress,
	Typography,
	useTheme,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import CustomCarousel from "../../components/reusable/CustomCarousel";
import { useGetSingleTrainingQuery } from "../../redux/trainings/trainingsApi";
import Carousel from "react-material-ui-carousel";
import CustomVideoCarousel from "../../components/reusable/CustomVideoCarousel";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { addToCart, selectCartItems } from "../../redux/cart/cartSlice";
import trainingsSlice from "../../redux/trainings/trainingsSlice";

const SingleTraining = () => {
	const { trainingId } = useParams();
	const theme = useTheme();
	const { data: training, isLoading } = useGetSingleTrainingQuery(
		{
			id: trainingId,
		},
		{
			refetchOnMountOrArgChange: 60,
		},
	);
	const dispatch = useDispatch();
	const cartItems = useSelector(selectCartItems);
	const user = useSelector(selectCurrentUser);
	const subscriptions = user?.subscriptions;
	const id = user?.id;
	const navigate = useNavigate();
	const isAllowed =
		subscriptions?.includes(trainingId) ||
		training?.user === id ||
		user?.role === "admin";
	const isInCart = cartItems?.some(({ id }) => id === trainingId);
	const notShow = !training?.approved || !training?.display;

	if (isLoading || !training)
		return (
			<CircularProgress
				sx={{ position: "absolute", top: "50%", left: "50%" }}
				size="3rem"
				thickness={7}
			/>
		);
	if (notShow && !isAllowed) {
		navigate("/", { replace: true });
	}

	const handleAddTocard = () => {
		if (!user) {
			navigate("/login");
		}
		dispatch(addToCart(training));
	};

	const images = training?.images?.map(({ url }) => url);

	return (
		<Box m="1.5rem 1rem" position="relative">
			<Box
				sx={{
					position: "absolute",
					top: 0,
					left: 0,
				}}>
				<Typography
					sx={{
						// position: "absolute",
						// top: 0,
						// left: 0,
						width: 300,
						display: { xs: "none", md: "initial" },
						color: theme.palette.secondary[200],
					}}
					variant="h6"
					fontWeight="600"
					fontSize={18}>
					Liked by{" "}
					<Typography
						component="span"
						variant="h6"
						fontWeight="900"
						color={theme.palette.secondary[400]}
						fontSize={18}>
						{training?.likes?.length} {` out of `}
						{training?.likes?.length + training?.dislikes?.length}
					</Typography>{" "}
					people
				</Typography>
				{!isAllowed && (
					<Typography
						variant="subtitle1"
						fontWeight="bold"
						color={theme.palette.secondary[200]}>
						Price:{" "}
						<Typography
							component="span"
							variant="h6"
							fontWeight="900"
							color={theme.palette.secondary[400]}
							fontSize={18}>
							${training?.price}
						</Typography>{" "}
					</Typography>
				)}
			</Box>
			<Typography
				variant="h2"
				color={theme.palette.secondary[200]}
				fontWeight="600"
				textAlign="center"
				gutterBottom>
				{training?.title}
			</Typography>
			<Typography
				sx={{
					// position: "absolute",
					// top: 0,
					// left: 0,
					width: 300,
					display: { xs: "initial", md: "none" },
					color: theme.palette.secondary[200],
				}}
				variant="h6"
				fontWeight="600"
				fontSize={18}>
				Liked by{" "}
				<Typography
					component="span"
					variant="h6"
					fontWeight="900"
					sx={{ mt: 1 }}
					color={theme.palette.secondary[400]}
					fontSize={15}>
					{training?.likes?.length} {` out of `}
					{training?.likes?.length + training?.dislikes?.length}
				</Typography>{" "}
				people
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
			{isAllowed ? (
				<>
					<Typography
						variant="h2"
						color={theme.palette.secondary[400]}
						fontWeight="900"
						textAlign="center"
						sx={{ mb: 4 }}>
						Exercises in the training
					</Typography>
					<Box className="parentBox">
						<Carousel
							fullHeightHover={false}
							navButtonsWrapperProps={{
								style: {
									bottom: "unset",
									top: "700px",
								},
							}}
							animation="fade"
							autoPlay={false}
							navButtonsAlwaysVisible={true}
							navButtonsAlwaysInvisible={
								training?.exercises?.length === 1 ? true : false
							}
							index={0}
							swipe={false}
							interval={6000}>
							{training?.exercises?.map((exercise) => {
								const urls = exercise?.videos?.map(({ url }) => url);
								return (
									<Box p={2}>
										<Typography
											variant="h2"
											color={theme.palette.secondary[200]}
											fontWeight="600"
											textAlign="center"
											gutterBottom>
											{exercise?.title}
										</Typography>
										<Box mb={4}>
											<CustomVideoCarousel
												videos={urls}
												height={"fit-content"}
											/>
										</Box>
										<Box p="1rem" display="flex" justifyContent="center">
											<Typography
												variant="h4"
												lineHeight={1.5}
												component="div"
												sx={{ minHeight: "fit-content", p: 1 }}
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
				</>
			) : isInCart ? (
				<Box display="flex" justifyContent="center" width="100%" mt={2}>
					<Button
						sx={{
							bgcolor: theme.palette.secondary[300],
							color: theme.palette.background.alt,
							"&:hover": {
								color: theme.palette.secondary[300],
								bgcolor: theme.palette.primary.main,
							},
						}}
						onClick={() => navigate("/cart")}>
						Go to cart to finish the purchase!
					</Button>
				</Box>
			) : (
				<Box display="flex" justifyContent="center" width="100%" mt={2}>
					<Button
						sx={{
							bgcolor: theme.palette.secondary[300],
							color: theme.palette.background.alt,
							"&:hover": {
								color: theme.palette.secondary[300],
								bgcolor: theme.palette.primary.main,
							},
						}}
						onClick={handleAddTocard}>
						Buy to view more
					</Button>
				</Box>
			)}
		</Box>
	);
};

export default SingleTraining;
