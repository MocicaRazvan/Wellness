import { Box, Button, Typography, useTheme } from "@mui/material";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../images/hero/HeaderHeroCrop.jpg";
import headerLast from "../../images/hero/HeaderLast.jpg";
import motivationHero from "../../images/hero/motivationHero.jpg";
import { selectCurrentUser } from "../../redux/auth/authSlice";
const images = [backgroundImage, motivationHero, headerLast];

const HeroCarousel = () => {
	const navigate = useNavigate();
	const user = useSelector(selectCurrentUser);
	const { palette } = useTheme();
	const heroRef = useRef();
	useEffect(() => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((e) => {
				if (e.isIntersecting) {
					e.target.classList.add("show");
				}
			});
		});
		observer.observe(heroRef.current);
	}, [heroRef]);
	return (
		<Box
			mt={-3}
			ref={heroRef}
			sx={{
				opacity: 0,
				filter: "blur(5px)",
				transform: `translateY(-100%)`,
				transition: "all 1.5s",
				"&.show": {
					opacity: 1,
					filter: "blur(0)",
					transform: `translateY(0)`,
				},
			}}>
			<Box
				position="relative"
				sx={{
					"& .carousel": {},
					"& .carousel .control-next.control-arrow:before ": {
						borderLeft: `8px solid ${palette.secondary[300]} !important`,
					},
					"& .carousel .control-prev.control-arrow:before ": {
						borderRight: `8px solid ${palette.secondary[300]} !important`,
					},
					"& .carousel .control-dots .dot": {
						bgcolor: palette.secondary[300],
					},
				}}
				sxBackground={{
					backgroundPosition: "center",
				}}>
				<Carousel
					autoPlay
					interval="9000"
					transitionTime="3000"
					infiniteLoop
					showStatus={false}
					showThumbs={false}
					className="carousel">
					{images.map((img, i) => (
						<div key={`img-hero-${i}`}>
							<img src={img} alt="" />
						</div>
					))}
				</Carousel>
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
						sx={{ fontSize: { xs: 24, sm: 45 } }}>
						Upgrade your Body
					</Typography>
					{user === null && (
						<Box display={{ xs: "flex", md: "none" }} justifyContent="center">
							<Button
								color="secondary"
								variant="contained"
								size="large"
								sx={{ minWidth: 80, mt: 5 }}
								onClick={() => void navigate("/register")}>
								Register
							</Button>
						</Box>
					)}

					<Typography
						color={palette.secondary[200]}
						align="center"
						variant="h5"
						sx={{
							mb: 4,
							mt: { sx: 4, sm: 10 },
							display: { xs: "none", md: "initial" },
						}}>
						Enjoy being free of insecurites, and be proud of what you have
						become!
					</Typography>
					<Box
						display={{ xs: "none", md: "flex" }}
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
			</Box>
		</Box>
	);
};

export default HeroCarousel;
