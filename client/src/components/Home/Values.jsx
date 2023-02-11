import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { Paper, useTheme } from "@mui/material";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

const item = {
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	p: 5,
};

const Values = ({ values, links }) => {
	const navigate = useNavigate();
	const { palette } = useTheme();
	const itemsRef = useRef([]);

	useEffect(() => {
		itemsRef.current = itemsRef.current.slice(0, values.length);
	}, [values.length]);

	useEffect(() => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((e) => {
				if (e.isIntersecting) {
					console.log(e.target);
					e.target.classList.add("show");
				}
			});
		});
		itemsRef.current.forEach((e) => observer.observe(e));
	}, [itemsRef]);

	return (
		<Box
			component="section"
			sx={{
				display: "flex",
				overflow: "hidden",
			}}>
			<Container
				sx={{
					mt: 15,
					mb: 30,
					display: "flex",
					position: "relative",
				}}>
				<Grid container spacing={5}>
					{values.map((value, i) => (
						<Grid
							item
							xs={12}
							md={4}
							key={value.title}
							ref={(el) => (itemsRef.current[i] = el)}
							sx={{
								opacity: 0,
								filter: "blur(5px)",
								transform: { xs: `translateY(-100%)`, sm: `translateX(-100%)` },
								transition: "all 1.5s",
								transitionDelay: `${3 * i}00ms`,
								"&.show": {
									opacity: 1,
									filter: "blur(0)",
									transform: {
										xs: `translateY(0)`,
										sm: `translateX(0)`,
									},
								},
							}}>
							<Paper
								onClick={() => void navigate(links[i])}
								sx={{
									...item,
									bgcolor: palette.background.alt,
									height: "20rem",
									cursor: "pointer",
								}}>
								{/* <Box
									component="img"
									src={value.src}
									sx={{ height: 55, cursor: "pointer" }}
									onClick={() => void navigate(links[i])}
								/> */}
								{value.icon}
								<Typography
									variant="h5"
									sx={{ my: 5 }}
									textAlign="center"
									color="secondary"
									fontWeight="600">
									{value.title}
								</Typography>
								<Typography variant="h5" color={palette.secondary[200]}>
									{value.body}
								</Typography>
							</Paper>
						</Grid>
					))}

					{/* <Grid item xs={12} md={4}>
						<Box sx={item}>
							<Box
								component="img"
								src={exerciseSvg}
								alt="graph"
								sx={{ height: 55, cursor: "pointer" }}
								onClick={() => void navigate("/trainings")}
							/>
							<Typography variant="h6" sx={{ my: 5 }} textAlign="center">
								Training Programs
							</Typography>
							<Typography variant="h5">
								{
									"Specially designed training programs that target what you are looking for, so you can start see results right away."
								}
							</Typography>
						</Box>
					</Grid>
					<Grid item xs={12} md={4}>
						<Box sx={item}>
							<Box
								component="img"
								src={cartSvg}
								alt="clock"
								sx={{ height: 55, cursor: "pointer" }}
								onClick={() => void navigate("/trainings")}
							/>
							<Typography variant="h6" sx={{ my: 5 }} textAlign="center">
								Exclusive rates
							</Typography>
							<Typography variant="h5">
								{
									"Best prices, because we want you to buy a program, not to sell a kidney."
								}
							</Typography>
						</Box>
					</Grid> */}
				</Grid>
			</Container>
		</Box>
	);
};

export default Values;
