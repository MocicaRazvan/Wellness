import {
	Box,
	CircularProgress,
	IconButton,
	Tooltip,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Filter from "../../components/reusable/Filter";
import { useGetPostsQuery } from "../../redux/posts/postsApiSlice";
import { selectCurrentSearch } from "../../redux/searchState/searchSlice";
import PostCard from "./PostCard";
import GridList from "../../components/reusable/GridList";
import CustomPagination from "../../components/reusable/CustomPagination";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

const AllPosts = () => {
	const [sorting, setSorting] = useState({});
	const [tags, setTags] = useState([]);
	const search = useSelector(selectCurrentSearch);
	const [page, setPage] = useState(1);
	const [pages, setPages] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(12);
	const theme = useTheme();
	const isNonMobile = useMediaQuery("(min-width:600px)");
	const user = useSelector(selectCurrentUser);
	const [like, setLike] = useState(null);
	const [dislike, setDislike] = useState(null);

	console.log({ like, dislike });

	const { data, isLoading, isError } = useGetPostsQuery(
		{
			sorting,
			search,
			tags,
			page,
			limit: rowsPerPage,
			like,
			dislike,
		} || "",
		{
			pollingInterval: 600000,
			refetchOnFocus: true,
			refetchOnMountOrArgChange: true,
		},
	);
	useEffect(() => {
		if (data) {
			setPage(data?.page);
			setPages(data?.pages);
		}
	}, [data]);

	if (isLoading)
		return (
			<CircularProgress
				sx={{ position: "absolute", top: "50%", left: "50%", height: "100vh" }}
				size="3rem"
				thickness={7}
			/>
		);

	return (
		<Box p={2}>
			<Typography
				variant="h2"
				color={theme.palette.secondary[200]}
				fontWeight="bold"
				textAlign="center"
				fontSize={!isNonMobile && "25px"}>
				Look at all these posts
			</Typography>
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				flexDirection={isNonMobile ? "row" : "column"}>
				<Box flex={1}>
					<Filter
						sorting={sorting}
						isLoading={false}
						isError={false}
						tags={tags}
						setSorting={setSorting}
						setTags={setTags}
					/>
				</Box>
				{user && (
					<Box
						flex={0.25}
						display="flex"
						justifyContent="start"
						alignItems="center"
						gap={1}>
						<Tooltip title={!like && "Liked posts"} arrow placement="bottom">
							<Box>
								<IconButton
									onClick={() => {
										setDislike(null);
										if (like) {
											setLike(null);
										} else {
											setLike(user?.id);
										}
									}}>
									<ThumbUpIcon
										sx={{
											color: like
												? theme.palette.secondary[300]
												: theme.palette.success.main,
										}}
									/>
								</IconButton>
							</Box>
						</Tooltip>
						<Tooltip
							title={!dislike && "Disliked posts"}
							arrow
							placement="bottom">
							<Box>
								<IconButton
									onClick={() => {
										setLike(null);
										if (dislike) {
											setDislike(null);
										} else {
											setDislike(user?.id);
										}
									}}>
									<ThumbDownIcon
										sx={{
											color: dislike
												? theme.palette.secondary[300]
												: theme.palette.error.main,
										}}
									/>
								</IconButton>
							</Box>
						</Tooltip>
					</Box>
				)}
			</Box>
			{data?.posts?.length === 0 && (
				<Typography
					fontSize={40}
					mt={6}
					fontWeight="bold"
					textAlign="center"
					color={theme.palette.secondary[300]}>
					No posts meet the criteria
				</Typography>
			)}
			<GridList items={data?.posts}>
				<PostCard />
			</GridList>
			<CustomPagination
				page={page}
				rowsPerPage={rowsPerPage}
				setPage={setPage}
				setRowsPerPage={setRowsPerPage}
				count={pages}
			/>
		</Box>
	);
};

export default AllPosts;
