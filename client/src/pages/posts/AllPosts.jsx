import {
	Box,
	CircularProgress,
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

const AllPosts = () => {
	const [sorting, setSorting] = useState({});
	const [tags, setTags] = useState([]);
	const search = useSelector(selectCurrentSearch);
	const [page, setPage] = useState(1);
	const [pages, setPages] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(12);
	const theme = useTheme();
	const isNonMobile = useMediaQuery("(min-width:600px)");

	const { data, isLoading, isError } = useGetPostsQuery(
		{
			sorting,
			search,
			tags,
			page,
			limit: rowsPerPage,
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
				// className="text-gradient"
				// sx={{
				// 	background: `-webkit-linear-gradient(${theme.palette.secondary[300]}, #333)`,
				// 	WebkitBackgroundClip: "text",
				// 	WebkitTextFillColor: "transparent",
				// }}
				variant="h2"
				color={theme.palette.secondary[200]}
				fontWeight="bold"
				textAlign="center"
				fontSize={!isNonMobile && "25px"}>
				Look at all these posts
			</Typography>
			<Filter
				sorting={sorting}
				isLoading={false}
				isError={false}
				tags={tags}
				setSorting={setSorting}
				setTags={setTags}
			/>
			{data?.posts?.length === 0 && (
				<Typography
					fontSize={40}
					mt={6}
					fontWeight="bold"
					textAlign="center"
					color={theme.palette.secondary[300]}>
					No posts meet the criterias
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
