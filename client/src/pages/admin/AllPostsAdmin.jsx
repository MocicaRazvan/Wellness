import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CircularProgress,
	Collapse,
	Tooltip,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
	const navigate = useNavigate();

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
					color={theme.palette.secondary[500]}
					gutterBottom>
					{post?.tags.map((t) => `${t} `)}
				</Typography>
				<Tooltip title="Click to see the post!" placement="bottom" arrow>
					<Typography
						variant="h5"
						color={theme.palette.secondary[300]}
						sx={{ cursor: "pointer", width: "fit-content" }}
						onClick={() => navigate(`/posts/find/${post?.id}`)}>
						{post?.title}
					</Typography>
				</Tooltip>
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
	const [limit, setLimit] = useState(25);
	const { palette } = useTheme();

	const { data, isLoading } = useGetPostsAdminQuery({ search, limit });
	console.log(data?.posts?.map(({ likes, dislikes }) => ({ likes, dislikes })));

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
			{data?.total > limit && (
				<Box display="flex" justifyContent="center" m={4} p={2}>
					<Button
						onClick={() => setLimit((prev) => prev + 25)}
						sx={{
							color: palette.background.default,
							bgcolor: palette.secondary[300],
							"&:hover": {
								color: palette.secondary[300],
								bgcolor: palette.primary.main,
							},
						}}>
						Load More
					</Button>
				</Box>
			)}
		</Box>
	);
};

export default AllPostsAdmin;
