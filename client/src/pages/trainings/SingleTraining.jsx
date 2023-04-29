import {
	Box,
	Button,
	CircularProgress,
	Fab,
	Fade,
	MobileStepper,
	Typography,
	useTheme,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import CustomCarousel from "../../components/reusable/CustomCarousel";
import { useGetSingleTrainingQuery } from "../../redux/trainings/trainingsApi";
import CustomVideoCarousel from "../../components/reusable/CustomVideoCarousel";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { addToCart, selectCartItems } from "../../redux/cart/cartSlice";
import { useState } from "react";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import CustomSnack from "../../components/reusable/CustomSnack";

const SingleTraining = () => {
	const { trainingId } = useParams();
	const theme = useTheme();
	const [open, setOpen] = useState(false);
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
	const [index, setIndex] = useState(0);

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
		} else {
			dispatch(addToCart(training));
		}
		setOpen(true);
	};

	const images = training?.images?.map(({ url }) => url);
	const handleIndex = (val) => {
		if (training?.exercises) {
			const len = training?.exercises.length;
			if (val) {
				setIndex((prev) => (prev + 1) % len);
			} else {
				setIndex((prev) => {
					if (prev === 0) {
						return len - 1;
					} else {
						return prev - 1;
					}
				});
			}
		}
	};

	return (
		<Box m="1.5rem 1rem" position="relative">
			<CustomSnack
				open={open}
				setOpen={setOpen}
				message={`${training?.title} added to cart`}
			/>
			<Box
				sx={{
					position: "absolute",
					top: 0,
					left: 0,
				}}>
				<Typography
					sx={{
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
				{/* <CustomCarousel images={images} height={{ xs: 300, md: 500 }} /> */}
				<Box width={"100%"} mb={4}>
					<CustomCarousel images={images} height={600} />
				</Box>
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
				<Box p={1}>
					<Typography
						variant="h2"
						color={theme.palette.secondary[400]}
						fontWeight="900"
						textAlign="center"
						sx={{ mb: 4 }}>
						Exercises in the training
					</Typography>
					<Box>
						<Box
							sx={{
								position: "sticky",
								top: "300px",
								right: "40px",
								zIndex: 10,
								display: training?.exercises?.length === 1 ? "none" : "flex",
							}}
							justifyContent="space-between"
							width="100">
							{" "}
							<Fab
								size="small"
								onClick={() => handleIndex(false)}
								sx={{
									bgcolor: theme.palette.secondary[600],
									"&:hover": {
										bgcolor: theme.palette.secondary[300],
									},
								}}>
								<KeyboardArrowLeft
									sx={{
										color: theme.palette.mode === "dark" ? "white" : "black",
										"&:hover": {
											color: theme.palette.mode === "dark" ? "black" : "white",
										},
									}}
								/>
							</Fab>
							<Fab
								size="small"
								onClick={() => handleIndex(true)}
								sx={{
									bgcolor: theme.palette.secondary[600],
									"&:hover": {
										bgcolor: theme.palette.secondary[300],
									},
								}}>
								<KeyboardArrowRight
									sx={{
										color: theme.palette.mode === "dark" ? "white" : "black",
										"&:hover": {
											color: theme.palette.mode === "dark" ? "black" : "white",
										},
									}}
								/>
							</Fab>
						</Box>
						<Box>
							{training?.exercises?.map((exercise, i) => {
								const urls = exercise?.videos?.map(({ url }) => url);
								return (
									<Fade in={i === index}>
										<Box p={2} display={i === index ? "block" : "none"}>
											<Typography
												variant="h2"
												color={theme.palette.secondary[200]}
												fontWeight="600"
												textAlign="center"
												mb={3}
												gutterBottom>
												{exercise?.title}
											</Typography>
											<Box mb={4}>
												<CustomVideoCarousel videos={urls} height={600} />
											</Box>
											<Box
												p="1rem"
												display="flex"
												justifyContent="center"
												mb={2}>
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
											{training?.exercises?.length > 1 && (
												<Box
													display="flex"
													justifyContent="center"
													width="100%">
													<MobileStepper
														onClick={(e) => {
															setIndex(
																[...e.target.parentElement.children].indexOf(
																	e.target,
																),
															);
														}}
														sx={{
															zIndex: 100,
															bgcolor: "transparent",
															"& .MuiMobileStepper-dot": {
																cursor: "pointer",
																bgcolor: theme.palette.secondary[100],
															},
															"& .MuiMobileStepper-dotActive": {
																bgcolor: theme.palette.secondary[500],
															},
														}}
														variant="dots"
														steps={training?.exercises?.length}
														position="static"
														activeStep={index}
													/>
												</Box>
											)}
										</Box>
									</Fade>
								);
							})}
						</Box>
					</Box>
				</Box>
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
