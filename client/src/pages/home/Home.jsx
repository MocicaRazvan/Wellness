import BookIcon from "@mui/icons-material/Book";
import SportsHandballIcon from "@mui/icons-material/SportsHandball";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import PaidIcon from "@mui/icons-material/Paid";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import jump from "../../images/parallax/jump.jpg";
import salad from "../../images/parallax/salad.jpg";
import success from "../../images/parallax/success.jpg";
import { Parallax } from "react-parallax";
import { alpha, Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTheme } from "@emotion/react";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import Values from "../../components/Home/Values";
import SmokingHero from "../../components/Home/SmokingHero";
import UserDialog from "../../components/Home/UserDialog";

const iconSize = 60;

const values1 = [
	{
		title: "The best posts about fitness",
		body: "From the best trainers and from tested sources, so you do not get the BRO bullshit and stop being stuck. ",
		icon: <BookIcon sx={{ fontSize: iconSize }} />,
	},
	{
		title: "Training Programs",
		body: "Specially designed training programs that target what you are looking for, so you can start see results right away.",
		icon: <SportsHandballIcon sx={{ fontSize: iconSize }} />,
	},
	{
		title: "Exclusive rates",
		body: "Best prices, because we want you to buy a program, not to sell a kidney.",
		icon: <ProductionQuantityLimitsIcon sx={{ fontSize: iconSize }} />,
	},
];

const values2 = [
	{
		title: "Register",
		body: "Sing Up and start.",
		icon: <HowToRegIcon sx={{ fontSize: iconSize }} />,
	},
	{
		title: "WYSIWYG",
		body: "Buy a training that you enjoy.",
		icon: <PaidIcon sx={{ fontSize: iconSize }} />,
	},
	{
		title: "Work",
		body: "Start working on your dream.",
		icon: <DirectionsRunIcon sx={{ fontSize: iconSize }} />,
	},
];

const insideStyles = {
	background: "white",
	padding: 20,
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%,-50%)",
};

const Home = () => {
	const navigate = useNavigate();
	const user = useSelector(selectCurrentUser);
	const { palette } = useTheme();
	return (
		<>
			<Box mt={-5}>
				<Parallax bgImage={jump} strength={600}>
					<div style={{ height: "100vh" }}>
						<Box
							position="absolute"
							top="50%"
							left="50%"
							display="flex"
							sx={{
								transform: "translate(-50%, -50%)",
							}}
							flexDirection="column">
							<Typography
								color={palette.secondary[200]}
								align="center"
								variant="h2"
								marked="center"
								fontWeight={900}
								sx={{ fontSize: { xs: 24, sm: 45 } }}>
								Upgrade your Body
							</Typography>

							<Typography
								color={palette.secondary[200]}
								align="center"
								variant="h5"
								sx={{
									mb: 4,
									mt: 10,
									// display: { md: "initial" },
								}}>
								Enjoy being free of insecurites, and be proud of what you have
								become!
							</Typography>
							<Box
								display={"flex"}
								flexDirection="column"
								justifyContent="center"
								alignItems="center">
								{user ? (
									<Button
										color="secondary"
										variant="contained"
										size="large"
										component="a"
										sx={{
											cursor: "default",
											minWidth: 100,
											mt: { xs: 20, md: 0 },
										}}>
										Welcome!
									</Button>
								) : (
									<Button
										color="secondary"
										variant="contained"
										size="large"
										component="a"
										sx={{ minWidth: 100, mt: { xs: 20, md: 0 } }}
										onClick={() => void navigate("/register")}>
										Register
									</Button>
								)}
								<Typography
									variant="body2"
									color={palette.secondary[200]}
									sx={{ mt: 2 }}>
									Discover the experience
								</Typography>
							</Box>
						</Box>
					</div>
				</Parallax>
			</Box>
			<Values values={values1} links={["/posts", "/trainings", "/trainings"]} />
			<Parallax bgImage={salad} strength={-300}>
				<div style={{ height: "100vh", backgroundColor: "rgba(0,0,0,0.2)" }}>
					<Box
						position="absolute"
						top="50%"
						left="50%"
						display="flex"
						sx={{
							transform: "translate(-50%, -50%)",
						}}
						flexDirection="column">
						<Typography
							color={palette.secondary[200]}
							align="center"
							variant="h2"
							marked="center"
							fontWeight={900}
							sx={{ fontSize: { xs: 24, sm: 45 } }}>
							Everyting you need to start your new life!
						</Typography>

						<Typography
							color={palette.secondary[200]}
							align="center"
							variant="h5"
							fontWeight={500}
							fontSize={22}
							sx={{
								mb: 4,
								mt: 10,
								cursor: "pointer",
								"&:hover": {
									color: palette.primary.main,
								},
							}}
							onClick={() => navigate("/posts")}>
							Just browse the posts to get started!
						</Typography>
					</Box>
				</div>
			</Parallax>
			<Values
				values={values2}
				links={["/register", "/trainings", "/trainings"]}
			/>
			<Parallax
				bgImage={success}
				strength={200}
				renderLayer={(percentage) => (
					<div>
						<Box
							style={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								position: "absolute",
								background: alpha(palette.secondary[400], percentage * 0.6),
								left: "50%",
								top: "50%",
								borderRadius: "50%",
								transform: "translate(-50%,-50%)",
								padding: 20,
								fontSize: percentage * 110,
								width: percentage * 500,
								height: percentage * 500,
							}}>
							<Typography
								color={palette.primary.main}
								align="center"
								variant="h2"
								marked="center"
								sx={{
									fontSize: { xs: 100 * percentage, md: 150 * percentage },
								}}>
								NO
							</Typography>
							<Typography
								color={palette.primary.main}
								align="center"
								variant="h2"
								marked="center"
								sx={{ fontSize: { xs: 80 * percentage, md: 80 * percentage } }}>
								EXCUSES
							</Typography>
						</Box>
					</div>
				)}>
				<div style={{ height: "100vh" }}></div>
			</Parallax>

			<SmokingHero />
			<UserDialog />
		</>
	);
};

export default Home;
