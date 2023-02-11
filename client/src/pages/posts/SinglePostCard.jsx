import Carousel from "react-material-ui-carousel";
import { Paper, Button, Typography, useTheme } from "@mui/material";
import { Box, Container } from "@mui/system";

const SinglePostCard = ({ post }) => {
	const theme = useTheme();
	return (
		<Container sx={{ mt: 2 }}>
			<Typography
				gutterBottom
				variant="h2"
				color={theme.palette.secondary[300]}
				textAlign="center"
				fontWeight="bold">
				{post?.title}
			</Typography>
			<Carousel
				animation="fade"
				navButtonsAlwaysVisible
				autoPlay={false}
				interval={6000}>
				{post?.images.map((item, i) => (
					<Paper
						key={`test3-item-${i}`}
						elevation={10}
						style={{ height: 400 }}
						className="HeightItem">
						<Box sx={{ width: "100%", height: "100%" }}>
							<img
								src={item.url}
								style={{ width: "100%", height: "100%", objectFit: "cover" }}
								alt=""
							/>
						</Box>
					</Paper>
				))}
			</Carousel>
			<Container sx={{ mt: 5 }}>
				<Typography
					varint="body1"
					gutterBottom
					component="div"
					color={theme.palette.secondary[200]}>
					<div dangerouslySetInnerHTML={{ __html: post?.body }} />
				</Typography>
			</Container>
		</Container>
	);
};

export default SinglePostCard;
