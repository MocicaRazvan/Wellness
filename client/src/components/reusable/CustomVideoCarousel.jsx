import { Paper } from "@mui/material";
import { Box, Container } from "@mui/system";
import Carousel from "react-material-ui-carousel";

const CustomCarousel = ({ videos, height }) => {
	return (
		<Container sx={{ mt: 2, width: "80%" }}>
			<Carousel
				animation="fade"
				navButtonsAlwaysVisible
				autoPlay={false}
				interval={6000}>
				{videos.map((item, i) => (
					<Paper
						key={`customcarousel-item-${i}`}
						elevation={0}
						style={{ height }}
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
						</Box>
					</Paper>
				))}
			</Carousel>
		</Container>
	);
};

export default CustomCarousel;
