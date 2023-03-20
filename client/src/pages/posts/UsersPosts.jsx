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
import { useGetPostsByUserQuery } from "../../redux/posts/postsApiSlice";
import { selectCurrentSearch } from "../../redux/searchState/searchSlice";
import PostCard from "./PostCard";
import GridList from "../../components/reusable/GridList";
import CustomPagination from "../../components/reusable/CustomPagination";
import { selectCurrentUser } from "../../redux/auth/authSlice";

const UsersPosts = () => {
	const [sorting, setSorting] = useState({});
	const [tags, setTags] = useState([]);
	const search = useSelector(selectCurrentSearch);
	const [page, setPage] = useState(1);
	const [pages, setPages] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(12);
	const theme = useTheme();
	const isNonMobile = useMediaQuery("(min-width:600px)");

	const user = useSelector(selectCurrentUser);
	const { data, isLoading } = useGetPostsByUserQuery(
		{ search, tags, sorting, page, limit: rowsPerPage, id: user?.id } || "",
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
				sx={{ position: "absolute", top: "50%", left: "50%" }}
				size="3rem"
				thickness={7}
			/>
		);

	return (
		<Box p={2}>
			<Typography
				className="text-gradient"
				variant="h2"
				color={theme.palette.secondary[200]}
				fontWeight="bold"
				textAlign="center"
				fontSize={!isNonMobile && "25px"}>
				Look at all your posts
			</Typography>
			<Filter
				sorting={sorting}
				isLoading={false}
				isError={false}
				tags={tags}
				setSorting={setSorting}
				setTags={setTags}
			/>
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

export default UsersPosts;
