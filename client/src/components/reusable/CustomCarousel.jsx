import { Paper } from "@mui/material";
import { Box, Container } from "@mui/system";
import Carousel from "react-material-ui-carousel";

const CustomCarousel = ({ images, height }) => {
	return (
		<Container sx={{ mt: 2, width: "80%" }}>
			<Carousel
				animation="fade"
				navButtonsAlwaysVisible
				autoPlay={false}
				interval={6000}>
				{images.map((item, i) => (
					<Paper
						key={`customcarousel-item-${i}`}
						elevation={0}
						sx={{ height }}
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
						</Box>
					</Paper>
				))}
			</Carousel>
		</Container>
	);
};

export default CustomCarousel;
