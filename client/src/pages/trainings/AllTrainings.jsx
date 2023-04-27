import { useTheme } from "@emotion/react";
import {
	Box,
	Button,
	CircularProgress,
	Typography,
	useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CustomPagination from "../../components/reusable/CustomPagination";
import Filter from "../../components/reusable/Filter";
import GridList from "../../components/reusable/GridList";
import { selectCurrentSearch } from "../../redux/searchState/searchSlice";
import { useGetTrainingsQuery } from "../../redux/trainings/trainingsApi";
import TrainingCard from "./TrainingCard";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import { selectCartItems } from "../../redux/cart/cartSlice";

const AllTrainings = () => {
	const [sorting, setSorting] = useState({});
	const [tags, setTags] = useState([]);
	const search = useSelector(selectCurrentSearch);
	const [page, setPage] = useState(1);
	const [pages, setPages] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(12);
	const theme = useTheme();
	const isNonMobile = useMediaQuery("(min-width:600px)");
	const user = useSelector(selectCurrentUser);
	const [curUser, setCurUser] = useState({ userId: null, subscriptions: null });
	const cartItems = useSelector(selectCartItems);
	const { data, isLoading, isError } = useGetTrainingsQuery(
		{
			sorting,
			search,
			tags,
			page,
			limit: rowsPerPage,
			curUser: JSON.stringify(curUser),
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
			console.log({ data });
		}
	}, [data]);

	useEffect(() => {
		if (!user) {
			setCurUser({ userId: null, subscriptions: null });
		}
	}, [user]);
	useEffect(() => {
		if (cartItems && user?.subscriptions) {
			console.log("chenge");

			setTimeout(() => {
				setCurUser((prev) => ({
					...prev,
					subscriptions: [
						...user?.subscriptions,
						...cartItems?.map(({ id }) => id),
					],
				}));
			}, 455);
		}
	}, [cartItems, user?.subscriptions]);
	console.log({ curUser });

	if (isLoading)
		return (
			<CircularProgress
				sx={{ position: "absolute", top: "50%", left: "50%", height: "100vh" }}
				size="3rem"
				thickness={7}
			/>
		);
	console.log({ curUser });
	return (
		<Box p={2}>
			<Typography
				// className="text-gradient"
				variant="h2"
				color={theme.palette.secondary[200]}
				fontWeight="bold"
				textAlign="center"
				fontSize={!isNonMobile && "25px"}>
				Look at all {curUser?.userId !== null ? "buyable " : "these "}
				trainings
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
						type="training"
					/>
				</Box>
				{user && (
					<Box
						flex={0.25}
						display="flex"
						justifyContent="start"
						alignItems="center">
						<Button
							variant="contained"
							size="large"
							startIcon={curUser.userId === null ? <LocalMallIcon /> : null}
							sx={{
								width: 120,
								bgcolor: theme.palette.secondary[300],
								color: theme.palette.background.default,
								"&:hover": {
									color: theme.palette.secondary[300],
									bgcolor: theme.palette.primary.main,
								},
							}}
							onClick={() => {
								if (curUser.userId !== null) {
									setCurUser({ userId: null, subscriptions: null });
								} else {
									setCurUser({
										userId: user?.id,
										subscriptions: [
											...user?.subscriptions,
											...cartItems?.map(({ id }) => id),
										],
									});
									// console.log({ userId });
								}
							}}>
							{curUser.userId === null ? "Buyable" : "All"}
						</Button>
					</Box>
				)}
			</Box>
			{data?.trainings?.length === 0 && (
				<Typography
					fontSize={40}
					mt={6}
					fontWeight="bold"
					textAlign="center"
					color={theme.palette.secondary[300]}>
					No trainings meet the criteria
				</Typography>
			)}
			<GridList items={data?.trainings}>
				<TrainingCard />
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

export default AllTrainings;
