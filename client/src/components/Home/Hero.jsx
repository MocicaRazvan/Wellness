import { Box, Button, Typography } from "@mui/material";
import backgroundImage from "../../images/HeaderHeroCrop.jpg";
import HeroLayout from "./HeroLayout";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { useTheme } from "@mui/material";
import { useEffect, useRef } from "react";

const Hero = () => {
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
			<HeroLayout
				sxBackground={{
					backgroundImage: `url(${backgroundImage})`,
					backgroundPosition: "center",
				}}>
				<Typography
					color={palette.secondary[200]}
					align="center"
					variant="h2"
					marked="center"
					sx={{ fontSize: { xs: 24, sm: 45 } }}>
					Upgrade your Body
				</Typography>
				<Typography
					color={palette.secondary[200]}
					align="center"
					variant="h5"
					sx={{
						mb: 4,
						mt: { sx: 4, sm: 10 },
						display: { xs: "none", md: "initial" },
					}}>
					Enjoy being free of insecurites, and be proud of what you have become
				</Typography>
				{user ? (
					<Button
						color="secondary"
						variant="contained"
						size="large"
						component="a"
						sx={{ minWidth: 100, mt: { xs: 20, md: 0 } }}>
						Welcome
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
			</HeroLayout>
		</Box>
	);
};

export default Hero;
