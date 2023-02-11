import { useTheme } from "@emotion/react";
import {
	Box,
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

const AllTrainings = () => {
	const [sorting, setSorting] = useState({});
	const [tags, setTags] = useState([]);
	const search = useSelector(selectCurrentSearch);
	const [page, setPage] = useState(1);
	const [pages, setPages] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(12);
	const theme = useTheme();
	const isNonMobile = useMediaQuery("(min-width:600px)");
	const { data, isLoading, isError } = useGetTrainingsQuery(
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
				sx={{ position: "absolute", top: "50%", left: "50%" }}
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
				Look at all these trainings
			</Typography>
			<Filter
				sorting={sorting}
				isLoading={false}
				isError={false}
				tags={tags}
				setSorting={setSorting}
				setTags={setTags}
			/>
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
