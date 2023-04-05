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
import { format } from "date-fns";
import UserAgreement from "../../components/reusable/UserAgreement";

const Post = ({ post, setDeleteId, setOpen }) => {
	const theme = useTheme();
	const [isExpanded, setIsExpanded] = useState(false);
	// const [deletePost] = useDeletePostMutation();
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
					{!isExpanded ? "See More" : "See Less"}
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
					<Box
						m={1}
						display={"flex"}
						justifyContent="space-start"
						gap={2}
						alignItems={"center"}
						width="100%">
						<Typography>id: </Typography>
						<Typography>{post?.id}</Typography>
					</Box>
					<Box
						m={1}
						display={"flex"}
						justifyContent="space-start"
						gap={2}
						alignItems={"center"}
						width="100%">
						<Typography>Author: </Typography>
						<Typography>{post?.user?.username} </Typography>
					</Box>
					<Box
						m={1}
						display={"flex"}
						justifyContent="space-start"
						gap={2}
						alignItems={"center"}
						width="100%">
						<Typography>CreatedAt:</Typography>
						<Typography>
							{format(new Date(post?.createdAt), "dd/MM/yyyy")}
						</Typography>
					</Box>
					<Box
						m={1}
						display={"flex"}
						justifyContent="space-start"
						gap={2}
						alignItems={"center"}
						width="100%">
						<Typography>UpdatedAt:</Typography>
						<Typography>
							{" "}
							{format(new Date(post?.updatedAt), "dd/MM/yyyy")}
						</Typography>
					</Box>
					<Button
						color="error"
						onClick={
							() => {
								setDeleteId(post?.id);
								setOpen((prev) => !prev);
							}

							// 	async () => {
							// 	try {
							// 		await deletePost({ id: post?.id }).unwrap();
							// 	} catch (error) {
							// 		console.log(error);
							// 	}
							// }
						}>
						DELETE
					</Button>
				</CardContent>
			</Collapse>
		</Card>
	);
};

const AllPostsAdmin = () => {
	const search = useSelector(selectCurrentSearch);
	const isNonMobile = useMediaQuery("(min-width: 1000px)");
	const [limit, setLimit] = useState(24);
	const { palette } = useTheme();
	const [deletePost] = useDeletePostMutation();
	const [open, setOpen] = useState(false);
	const [deleteId, setDeleteId] = useState(null);

	const handleDelete = async (id) => {
		if (deleteId) {
			try {
				await deletePost({ id }).unwrap();
			} catch (error) {
				console.log(error);
			}
		}
	};

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
			<UserAgreement
				open={open}
				setOpen={setOpen}
				title={"Confirm delete"}
				text={
					"Are you sure you want to delete this post? You can't undo after you press Agree, be careful what you want."
				}
				handleAgree={async () => await handleDelete(deleteId)}
			/>
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
					<Post
						key={post?.id}
						post={post}
						setDeleteId={setDeleteId}
						setOpen={setOpen}
					/>
				))}
			</Box>
			{data?.total > limit && (
				<Box display="flex" justifyContent="center" m={4} p={2}>
					<Button
						onClick={() => setLimit((prev) => prev + 24)}
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
