import Carousel from "react-material-ui-carousel";
import { Paper, Button, Typography, useTheme, IconButton } from "@mui/material";
import { Box, Container } from "@mui/system";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { usePostActionsMutation } from "../../redux/posts/postsApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";

const SinglePostCard = ({ post }) => {
	const theme = useTheme();
	const [actionPost] = usePostActionsMutation();
	const navigate = useNavigate();
	const notShow = !post?.approved || !post?.display;
	const handleAction = async (id, action) => {
		try {
			await actionPost({ id, action }).unwrap();
		} catch (error) {
			console.log(error);
		}
	};
	const user = useSelector(selectCurrentUser);
	if (notShow && user?.id !== post?.user?._id && user?.role !== "admin") {
		navigate("/");
	}

	return (
		<Container sx={{ mt: 2 }}>
			<Box position="relative">
				{user && (
					<Box
						position={{ xs: "relative", md: "absolute" }}
						top="0"
						left="0"
						display="flex"
						alignItems="center"
						justifyContent="start"
						gap={0.5}>
						<IconButton
							onClick={async () => await handleAction(post?.id, "likes")}>
							<ThumbUpIcon
								sx={{
									color: post?.likes.includes(user?.id)
										? theme.palette.secondary[300]
										: theme.palette.success.main,
								}}
							/>
						</IconButton>
						<Typography
							sx={{ alignSelf: "end" }}
							gutterBottom
							variant="body2"
							fontSize={15}
							color={theme.palette.secondary[300]}>
							{post?.likes?.length} likes
						</Typography>
						<IconButton
							onClick={async () => await handleAction(post?.id, "dislikes")}>
							<ThumbDownIcon
								sx={{
									color: post?.dislikes.includes(user?.id)
										? theme.palette.secondary[300]
										: theme.palette.error.main,
								}}
							/>
						</IconButton>
						<Typography
							sx={{ alignSelf: "end" }}
							gutterBottom
							variant="body2"
							fontSize={15}
							color={theme.palette.secondary[300]}>
							{post?.dislikes?.length} dislikes
						</Typography>
					</Box>
				)}
				<Typography
					gutterBottom
					variant="h2"
					color={theme.palette.secondary[300]}
					textAlign="center"
					letterSpacing={1.5}
					sx={{
						textDecoration: "underline",
						mb: 2,
					}}
					fontWeight="bold">
					{post?.title}
				</Typography>
			</Box>
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
						<Box sx={{ width: "100%", height: "100%", position: "relative" }}>
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
					fontSize={17}
					color={theme.palette.secondary[100]}>
					<div dangerouslySetInnerHTML={{ __html: post?.body }} />
				</Typography>
			</Container>
		</Container>
	);
};

export default SinglePostCard;
