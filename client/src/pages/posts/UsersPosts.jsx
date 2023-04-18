import {
	Box,
	Button,
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
import DoNotDisturbOnOutlinedIcon from "@mui/icons-material/DoNotDisturbOnOutlined";
import BrowserNotSupportedIcon from "@mui/icons-material/BrowserNotSupported";

const UsersPosts = () => {
	const [sorting, setSorting] = useState({});
	const [tags, setTags] = useState([]);
	const search = useSelector(selectCurrentSearch);
	const [page, setPage] = useState(1);
	const [pages, setPages] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(12);
	const [notApproved, setNotApproved] = useState(false);
	const [notDisplayed, setNotDisplayed] = useState(false);
	const theme = useTheme();
	const isNonMobile = useMediaQuery("(min-width:750px)");

	const user = useSelector(selectCurrentUser);
	const { data, isLoading } = useGetPostsByUserQuery(
		{
			search,
			tags,
			sorting,
			page,
			limit: rowsPerPage,
			id: user?.id,
			notApproved,
			notDisplayed,
		} || "",
		{ refetchOnMountOrArgChange: 60, refetchOnFocus: true },
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
				variant="h2"
				color={theme.palette.secondary[200]}
				fontWeight="bold"
				textAlign="center"
				fontSize={!isNonMobile && "25px"}>
				{notApproved
					? "Look at your unapproved posts"
					: notDisplayed
					? "Look at your undisplayed posts"
					: "Look at your unapproved posts"}
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
				<Box
					flex={0.5}
					display="flex"
					alignItems="center"
					gap={2}
					justifyContent="center">
					{user?.role !== "admin" && (
						<Button
							sx={{
								bgcolor: theme.palette.secondary[300],
								color: theme.palette.background.default,
								width: 180,
								"&:hover": {
									color: theme.palette.secondary[300],
									bgcolor: theme.palette.background.default,
								},
							}}
							onClick={() => setNotApproved((prev) => !prev)}
							variant="outlined"
							startIcon={
								notApproved ? null : ( // <CheckCircleOutlineRoundedIcon />
									<DoNotDisturbOnOutlinedIcon />
								)
							}>
							{notApproved ? "All By Approved" : "Not Approved "}
						</Button>
					)}
					<Button
						sx={{
							bgcolor: theme.palette.secondary[300],
							color: theme.palette.background.default,
							width: 180,
							"&:hover": {
								color: theme.palette.secondary[300],
								bgcolor: theme.palette.background.default,
							},
							"&:disabled": {
								bgcolor: theme.palette.grey[500],
								color: theme.palette.secondary[300],
							},
						}}
						onClick={() => setNotDisplayed((prev) => !prev)}
						variant="outlined"
						disabled={notApproved}
						startIcon={
							notDisplayed ? null : ( // <CheckCircleOutlineRoundedIcon />
								<BrowserNotSupportedIcon />
							)
						}>
						{notDisplayed ? "All By Displayed" : "Not Displayed "}
					</Button>
				</Box>
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
			<GridList items={data?.posts} user="true">
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
