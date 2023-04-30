import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { Fab, Fade, MobileStepper, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";

const CustomCarousel = ({ images, height, width = "80%" }) => {
	// return (
	// 	<Container sx={{ mt: 2, width: "80%" }}>
	// 		<Carousel
	// 			animation="fade"
	// 			navButtonsAlwaysVisible={true}
	// 			indicators={images?.length === 1 ? false : true}
	// 			navButtonsAlwaysInvisible={images?.length === 1 ? true : false}
	// 			autoPlay={false}
	// 			swipe={false}
	// 			interval={6000}>
	// 			{images.map((item, i) => (
	// 				<Paper
	// 					key={`customcarousel-item-${i}`}
	// 					elevation={0}
	// 					sx={{ height }}
	// 					className="HeightItem">
	// 					<Box sx={{ width: "100%", height: "100%" }}>
	// 						{type === "image" ? (
	// 							<img
	// 								src={item}
	// 								style={{
	// 									width: "100%",
	// 									height: "100%",
	// 									objectFit: "cover",
	// 									borderRadius: 5,
	// 								}}
	// 								alt=""
	// 							/>
	// 						) : (
	// 							<video
	// 								src={item}
	// 								controls
	// 								style={{
	// 									width: "100%",
	// 									height: "100%",
	// 									objectFit: "cover",
	// 									borderRadius: 5,
	// 								}}
	// 								alt=""
	// 							/>
	// 						)}
	// 					</Box>
	// 				</Paper>
	// 			))}
	// 		</Carousel>
	// 	</Container>
	// );
	const [index, setIndex] = useState(0);
	const theme = useTheme();
	const handleIndex = (val) => {
		if (images) {
			const len = images.length;
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
		<Box
			sx={{
				mt: 2,
				width,
				height,
				position: "relative",
				p: 0,
				m: "0 auto",
			}}>
			<Box
				justifyContent="space-between"
				sx={{
					zIndex: 100,
					position: "absolute",
					top: "50%",
					width: "100%",
					px: 2,
					display: images.length === 1 ? "none" : "flex",
				}}>
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
			{images.map((item, i) => (
				<Fade in={i === index}>
					<Box
						display={i === index ? "block" : "none"}
						key={`custombox-item-${i}`}
						width="100%"
						style={{ height }}
						mt={2}
						className="HeightItem">
						<Box sx={{ width: "100%", height: "100%" }}>
							<img
								src={item}
								style={{
									width: "100%",
									height: "100%",
									objectFit: "cover",
									borderRadius: 5,
								}}
								alt=""
							/>
							{images.length > 1 && (
								<Box display="flex" justifyContent="center" width="100%">
									<MobileStepper
										onClick={(e) => {
											setIndex(
												[...e.target.parentElement.children].indexOf(e.target),
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
										steps={images.length}
										position="static"
										activeStep={index}
									/>
								</Box>
							)}
						</Box>
					</Box>
				</Fade>
			))}
		</Box>
	);
};

export default CustomCarousel;
