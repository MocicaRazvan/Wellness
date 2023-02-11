import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CircularProgress,
	Collapse,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import Header from "../../components/reusable/Header";
import {
	useDeletePostMutation,
	useGetPostsAdminQuery,
} from "../../redux/posts/postsApiSlice";
import { selectCurrentSearch } from "../../redux/searchState/searchSlice";

const Post = ({ post }) => {
	const theme = useTheme();
	const [isExpanded, setIsExpanded] = useState(false);
	const [deletePost] = useDeletePostMutation();

	return (
		<Card
			sx={{
				backgroundImage: "none",
				backgroundColor: theme.palette.background.alt,
				borderRadius: "0.55rem",
			}}>
			<CardContent>
				<Typography
					sx={{ fontSize: 14 }}
					color={theme.palette.secondary[700]}
					gutterBottom>
					{post?.tags.map((t) => `${t} `)}
				</Typography>
				<Typography
					variant="h5"
					component="div"
					color={theme.palette.secondary[300]}>
					{post?.title}
				</Typography>
				<Typography sx={{ mb: "1.5rem" }} color={theme.palette.secondary[400]}>
					{post?.approved}
				</Typography>
				<Box display="flex" alignItems="center" justifyContent="space-around">
					<Typography color={theme.palette.secondary[200]} variant="body2">
						Likes: {post?.likes?.length}
					</Typography>
					<Typography variant="body2" color={theme.palette.secondary[200]}>
						Dislikes: {post?.dislikes?.length}
					</Typography>
				</Box>
			</CardContent>
			<CardActions>
				<Button
					variant="primary"
					size="small"
					onClick={() => setIsExpanded((prev) => !prev)}>
					See More
				</Button>
			</CardActions>
			<Collapse
				in={isExpanded}
				timeout="auto"
				unmountOnExit
				sx={{
					color: theme.palette.neutral[300],
				}}>
				<CardContent>
					<Typography>id: {post?.id}</Typography>
					<Typography>Author: {post?.user?.username}</Typography>
					<Typography>CreatedAt: {post?.createdAt}</Typography>
					<Typography gutterBottom>UpdatedAt: {post?.updatedAt}</Typography>
					<Button
						color="error"
						onClick={async () => {
							try {
								await deletePost({ id: post?.id }).unwrap();
							} catch (error) {
								console.log(error);
							}
						}}>
						DELTE
					</Button>
				</CardContent>
			</Collapse>
		</Card>
	);
};

const AllPostsAdmin = () => {
	const search = useSelector(selectCurrentSearch);
	const isNonMobile = useMediaQuery("(min-width: 1000px)");

	const { data, isLoading } = useGetPostsAdminQuery({ search });

	if (isLoading || !data)
		return (
			<CircularProgress
				sx={{ position: "absolute", top: "50%", left: "50%" }}
				size="3rem"
				thickness={7}
			/>
		);
	return (
		<Box m="1.5rem 2.5rem">
			<Header title="Posts" subtitle="See the list of posts." />
			<Box
				mt="20px"
				display="grid"
				gridTemplateColumns="repeat(4,minmax(0, 1fr))"
				justifyContent="space-between"
				rowGap="20px"
				columnGap="1.33%"
				sx={{
					"& > div": {
						gridColumn: isNonMobile ? undefined : "span 4",
					},
				}}>
				{data?.posts.map((post) => (
					<Post key={post?.id} post={post} />
				))}
			</Box>
		</Box>
	);
};

export default AllPostsAdmin;
