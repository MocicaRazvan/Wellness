import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { Fab, Fade, MobileStepper } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";

const CustomCarousel = ({ videos, height }) => {
	const [index, setIndex] = useState(0);
	const handleIndex = (val) => {
		if (videos) {
			const len = videos.length;
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
				width: "80%",
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
					display: videos.length === 1 ? "none" : "flex",
				}}>
				<Fab
					size="small"
					onClick={() => handleIndex(false)}
					sx={{
						bgcolor: "#494949",
						zIndex: "1 !important",
						"&:hover": {
							bgcolor: "rgba(0,0,0,0.4)",
							color: "rgba(255,255,255,0.4)",
						},
					}}>
					<KeyboardArrowLeft sx={{ color: "white" }} />
				</Fab>
				<Fab
					size="small"
					onClick={() => handleIndex(true)}
					sx={{
						bgcolor: "#494949",
						zIndex: "1 !important",
						"&:hover": {
							bgcolor: "rgba(0,0,0,0.4)",
							color: "rgba(255,255,255,0.4)",
						},
					}}>
					<KeyboardArrowRight sx={{ color: "white" }} />
				</Fab>
			</Box>
			{videos.map((item, i) => (
				<Fade in={i === index}>
					<Box
						display={i === index ? "block" : "none"}
						key={`custombox-item-${i}`}
						width="100%"
						style={{ height }}
						mt={2}
						className="HeightItem">
						<Box sx={{ width: "100%", height: "100%" }}>
							<video
								controls
								autoPlay={false}
								src={item}
								style={{
									width: "100%",
									height: "100%",
									objectFit: "cover",
								}}
							/>
							{videos.length > 1 && (
								<Box display="flex" justifyContent="center" width="100%">
									<MobileStepper
										sx={{ bgcolor: "transparent" }}
										variant="dots"
										steps={videos.length}
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
