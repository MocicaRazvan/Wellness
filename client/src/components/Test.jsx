import BookIcon from "@mui/icons-material/Book";
import SportsHandballIcon from "@mui/icons-material/SportsHandball";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import PaidIcon from "@mui/icons-material/Paid";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import HotelIcon from "@mui/icons-material/Hotel";
import jump from "../images/parallax/jump.jpg";
import salad from "../images/parallax/salad.jpg";
import success from "../images/parallax/success.jpg";
import { Parallax } from "react-parallax";
import { alpha, Box, Button, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Values from "../components/Home/Values";
import SmokingHero from "../components/Home/SmokingHero";
import UserDialog from "../components/Home/UserDialog";
import { selectCurrentUser } from "../redux/auth/authSlice";
import { useTrail, a } from "@react-spring/web";
import React, { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import {
	VerticalTimeline,
	VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

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

const trails = {
	position: "relative",
	willChange: "transform, opacity",
};

const Trail = ({ open, children, h = "80px" }) => {
	const items = React.Children.toArray(children);
	const trail = useTrail(items.length, {
		config: { mass: 7, tension: 3000, friction: 500 },
		opacity: open ? 1 : 0,
		x: open ? 0 : 20,
		height: open ? 110 : 0,
		from: { opacity: 0, x: 20, height: 0 },
	});
	return (
		<div>
			{trail.map(({ height, ...style }, index) => (
				<a.div key={index} style={{ ...style, ...trails, height: h }}>
					<a.div style={{ height }}>{items[index]}</a.div>
				</a.div>
			))}
		</div>
	);
};

const items = [
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

const Timeline = ({ items }) => {
	const { palette } = useTheme();
	return (
		<VerticalTimeline lineColor={palette.secondary[300]}>
			{items.map(({ date, title, text, icon }) => (
				<VerticalTimelineElement
					className="vertical-timeline-element--work"
					contentStyle={{
						backgroundColor: palette.primary.main,
						boxShadow: `0 3px 0 ${palette.secondary[300]}`,
					}}
					contentArrowStyle={{
						borderRight: `7px solid ${palette.secondary[300]}`,
					}}
					date={
						<Typography
							align="center"
							variant="h2"
							textAlign="start"
							fontWeight={700}
							sx={{
								fontSize: 45,
								color: `${
									palette.mode === "dark"
										? palette.secondary[200]
										: palette.secondary[500]
								}!important`,
							}}>
							{date}
						</Typography>
					}
					iconStyle={{ background: palette.secondary[500], boxShadow: "none" }}
					icon={icon}>
					<Typography
						align="center"
						variant="h2"
						textAlign="center"
						fontWeight={900}
						sx={{
							fontSize: 45,
							color: `${palette.secondary[400]}!important`,
							mb: 2,
						}}>
						{title}
					</Typography>
					<Box display="flex" alignItems="center" justifyContent="center">
						<Typography
							align="center"
							variant="h2"
							textAlign="center"
							fontWeight={500}
							sx={{
								fontSize: { xs: 24, sm: 33, md: 45 },
								color: `${palette.secondary[200]}!important`,
							}}>
							{text}
						</Typography>
					</Box>
				</VerticalTimelineElement>
			))}
		</VerticalTimeline>
	);
};

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
			{ threshold: 0.75 },
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
											sx={{
												cursor: "default",
												minWidth: 100,
												mt: { xs: 2, md: 0 },
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
			<Parallax
				bgImage={success}
				strength={500}
				renderLayer={(percentage) => (
					<div>
						{/* <Box
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
						</Box> */}
					</div>
				)}>
				<div
					style={{
						minHeight: "100vh",
						backgroundColor: `rgba(0,0,0,${
							palette.mode === "dark" ? "0.3" : "0.3"
						})`,
					}}>
					{" "}
					<Timeline items={items} />{" "}
				</div>
			</Parallax>

			<SmokingHero />
			<UserDialog />
		</>
	);
};

export default Home;
