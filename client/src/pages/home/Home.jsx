import BookIcon from "@mui/icons-material/Book";
import SportsHandballIcon from "@mui/icons-material/SportsHandball";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import PaidIcon from "@mui/icons-material/Paid";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import HotelIcon from "@mui/icons-material/Hotel";
import jump from "../../images/parallax/jump.jpg";
import salad from "../../images/parallax/salad.jpg";
import success from "../../images/parallax/success.jpg";
import { Parallax } from "react-parallax";
import { alpha, Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTheme } from "@emotion/react";
import React, { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import Trail from "../../components/Home/Trail";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import Values from "../../components/Home/Values";
import SmokingHero from "../../components/Home/SmokingHero";
import UserDialog from "../../components/Home/UserDialog";
import Timeline from "../../components/Home/Timeline";

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

const timeLine = [
	{
		date: "Prepare",
		title: "Be aware",
		text: `Realize your problems and target them. Don't be afraid to make changes that you are making you uncomfortable.`,
		icon: <BookIcon sx={{ fontSize: iconSize }} />,
	},

	{
		date: "",
		title: "Get comfortable with being afraid",
		text: `It is normal to feel overwhelmed and to be inscure about getting started. Don't let this feelings stop you. `,
		icon: <BookIcon sx={{ fontSize: iconSize }} />,
	},

	{
		date: "",
		title: "Make a plan",
		text: `Plan ahead and be very structural. Make realistic targets and try to do things your way, don't let others decide your journey.`,
		icon: <BookIcon sx={{ fontSize: iconSize }} />,
	},

	{
		date: "Start working",
		title: "Step by step",
		text: `Be patiente and know that your life is a marathon not a sprint. Don't seek for fast fiexes just be happy with every little progress.`,
		icon: <DirectionsRunIcon sx={{ fontSize: iconSize }} />,
	},

	{
		date: "",
		title: "Work you ass off",
		text: `Working hard pays off. Realize that every change needs some sacrfices and be prepared to make some. In the end you will thank yourself.`,
		icon: <DirectionsRunIcon sx={{ fontSize: iconSize }} />,
	},
	{
		date: "",
		title: "Becoming comfortable with your new life",
		text: `After some time evrything you said it was to hard will become a trivial part of your life. When this happen you can pat yourself on the back and see your true progress.`,
		icon: <DirectionsRunIcon sx={{ fontSize: iconSize }} />,
	},
	{
		date: "Stay consistent",
		title: "Don't let the results slow you down",
		text: `Don't get to comfortable and think that you can't lose what you achived. This is where the difference between the sprint and the marathon is made.`,
		icon: <HotelIcon sx={{ fontSize: iconSize }} />,
	},
];

const Home = () => {
	const navigate = useNavigate();
	const user = useSelector(selectCurrentUser);
	const { palette } = useTheme();
	const itemsRef = useRef([]);
	const [openParallax, setOpenParallax] = useState({
		firstParallax: false,
		secondParallax: false,
	});

	useEffect(() => {
		itemsRef.current = itemsRef.current.slice(0, 2);
	}, []);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((e) => {
					console.log(e.target.id);
					if (e.isIntersecting) {
						setTimeout(() => {
							setOpenParallax((prev) => ({ ...prev, [e.target.id]: true }));
						}, 555);
					} else {
						setOpenParallax((prev) => ({ ...prev, [e.target.id]: false }));
					}
				});
			},
			{ threshold: 0.65 },
		);
		itemsRef.current.forEach((e) => observer.observe(e));
	}, [itemsRef]);

	if (!jump) {
		return;
	}

	return (
		<>
			<Box mt={-5}>
				<Parallax bgImage={jump} strength={600}>
					<div
						id="firstParallax"
						ref={(el) => (itemsRef.current[0] = el)}
						style={{ height: "100vh", position: "relative" }}>
						<Box
							position="absolute"
							top="50%"
							left="50%"
							display="flex"
							sx={{
								transform: "translate(-50%, -50%)",
							}}
							flexDirection="column">
							<Trail open={openParallax.firstParallax}>
								<Typography
									color={palette.secondary[200]}
									align="center"
									variant="h2"
									textAlign="center"
									fontWeight={900}
									sx={{
										fontSize: { xs: 24, sm: 33, md: 45 },
										display: "inline-block",
										width: "100%",
									}}>
									Upgrade your Body
								</Typography>
								<Typography
									color={palette.secondary[200]}
									align="center"
									textAlign="center"
									variant="h5"
									sx={{
										display: "inline-block",
									}}>
									Enjoy being free of insecurites, and be proud of what you have
									become!
								</Typography>
							</Trail>
							<Box
								display={"flex"}
								flexDirection="column"
								justifyContent="center"
								alignItems="center">
								<Trail open={openParallax.firstParallax}>
									{user ? (
										<Button
											color="secondary"
											variant="contained"
											size="large"
											component="a"
											disableRipple
											sx={{
												cursor: "default",
												minWidth: 100,
												bgcolor: palette.secondary[300],
												mt: { xs: 2, md: 0 },
												"&:hover": { bgcolor: palette.secondary[300] },
											}}>
											Welcome!
										</Button>
									) : (
										<Button
											color="secondary"
											variant="contained"
											size="large"
											component="a"
											sx={{
												minWidth: 100,
												mt: { xs: 2, md: 0 },
												bgcolor: palette.secondary[300],
											}}
											onClick={() => void navigate("/register")}>
											Register
										</Button>
									)}
								</Trail>
								<Trail open={openParallax.firstParallax}>
									<Typography
										variant="body2"
										color={palette.secondary[200]}
										sx={{ mt: 2, display: "inline-block" }}>
										Discover the experience
									</Typography>
								</Trail>
							</Box>
						</Box>
					</div>
				</Parallax>
			</Box>
			<Values values={values1} links={["/posts", "/trainings", "/trainings"]} />

			<Parallax bgImage={salad} strength={-500}>
				<div
					id="secondParallax"
					style={{ height: "100vh", backgroundColor: "rgba(0,0,0,0.2)" }}
					ref={(el) => (itemsRef.current[1] = el)}>
					<Box
						position="absolute"
						top="50%"
						left="50%"
						display="flex"
						sx={{
							transform: "translate(-50%, -50%)",
						}}
						flexDirection="column">
						<Trail open={openParallax.secondParallax}>
							<Box display="inline-flex" flexDirection={"column"}>
								<Typography
									color={palette.secondary[200]}
									align="center"
									variant="h2"
									marked="center"
									fontWeight={900}
									sx={{
										fontSize: { xs: 24, sm: 45 },
										display: "inline",
										width: "100%",
									}}>
									Everyting you need to start your new life!
								</Typography>
								<Typography
									color={palette.secondary[200]}
									textAlign="center"
									align="center"
									variant="h5"
									fontWeight={500}
									fontSize={22}
									sx={{
										mb: 4,
										mt: 10,
										cursor: "pointer",
										display: "inline-block",
										width: "100%",
										"&:hover": {
											color: palette.primary.main,
										},
									}}
									onClick={() => navigate("/posts")}>
									Just browse the posts to get started!
								</Typography>
							</Box>
						</Trail>
					</Box>
				</div>
			</Parallax>
			<Values
				values={values2}
				links={["/register", "/trainings", "/trainings"]}
			/>
			<Parallax bgImage={success} strength={500}>
				<div
					style={{
						minHeight: "100vh",
						backgroundColor: `rgba(0,0,0,${
							palette.mode === "dark" ? "0.3" : "0.3"
						})`,
					}}>
					<Timeline items={timeLine} />
				</div>
			</Parallax>

			<SmokingHero />
			<UserDialog />
		</>
	);
};

export default Home;
