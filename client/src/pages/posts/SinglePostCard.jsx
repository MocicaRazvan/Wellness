import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { IconButton, Typography, useTheme } from "@mui/material";
import { Box, Container } from "@mui/system";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomCarousel from "../../components/reusable/CustomCarousel";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { usePostActionsMutation } from "../../redux/posts/postsApiSlice";

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
	const isAuthor = user && user?.id === post?.user?._id;

	return (
		<Box sx={{ mt: 2, width: { xs: "100%", md: "80%" } }}>
			<Box position="relative" width="100%">
				<Box
					position={{ xs: "relative", md: "absolute" }}
					top="0"
					left="0"
					display="flex"
					alignItems="center"
					justifyContent="start"
					width="100%"
					gap={0.5}>
					<IconButton
						disabled={isAuthor}
						onClick={async () => {
							if (!user) {
								navigate("/login");
							} else {
								await handleAction(post?.id, "likes");
							}
						}}>
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
						disabled={isAuthor}
						onClick={async () => {
							if (!user) {
								navigate("/login");
							} else {
								await handleAction(post?.id, "dislikes");
							}
						}}>
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

			<Box width={"100%"}>
				<CustomCarousel
					width="100%"
					images={post?.images?.map(({ url }) => url)}
					height={600}
				/>
			</Box>
			<Container sx={{ mt: 8 }}>
				<Typography
					varint="h4"
					gutterBottom
					component="div"
					fontSize={{ xs: 17, md: 20 }}
					lineHeight={1.5}
					color={theme.palette.secondary[100]}>
					<div dangerouslySetInnerHTML={{ __html: post?.body }} />
				</Typography>
			</Container>
		</Box>
	);
};

export default SinglePostCard;
