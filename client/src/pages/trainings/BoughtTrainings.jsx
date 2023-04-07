import { Button, CircularProgress, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import {
	useGetBoughtUserTrainingsQuery,
	useTrainingActionsMutation,
} from "../../redux/trainings/trainingsApi";
import Header from "../../components/reusable/Header";
import CustomDataGrid from "../../components/dataGrid/CustomDataGrid";

const BoughtTrainings = () => {
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(20);
	const [sort, setSort] = useState({});
	const [search, setSearch] = useState("");
	const [searchInput, setSearchInput] = useState("");
	const user = useSelector(selectCurrentUser);

	const { data, isLoading } = useGetBoughtUserTrainingsQuery(
		{
			page,
			pageSize,
			sort: JSON.stringify(sort),
			search,
		},
		{ skip: !user?.id },
	);

	const [trainingAction] = useTrainingActionsMutation();

	const handleAction = async (id, action) => {
		try {
			await trainingAction({ id, action }).unwrap();
		} catch (error) {
			console.log(error);
		}
	};

	if (!user?.id)
		return (
			<CircularProgress
				sx={{ position: "absolute", top: "50%", left: "50%" }}
				size="3rem"
				thickness={7}
			/>
		);

	const columns = [
		{
			field: "id",
			headerName: "ID",
			flex: 1,
		},
		{
			field: "title",
			headerName: "Title",
			flex: 1,
		},
		{
			field: "user",
			headerName: "user ID",
			flex: 1,
		},
		{
			field: "createdAt",
			headerName: "CreatedAt",
			flex: 1,
		},
		{
			field: "tags",
			headerName: "Tags",
			flex: 2,
		},
		{
			field: "action",
			headerName: "Actions",
			flex: 2,
			renderCell: (params) => {
				return (
					<Box
						sx={{
							width: "100%",
							display: "flex",
							alignItems: "center",
							gap: 1,
						}}>
						<Link
							to={`/trainings/find/${params.row.id}`}
							style={{ textDecoration: "none" }}>
							<Button variant="contained" size="small" className="cellBtn">
								View
							</Button>
						</Link>
						<IconButton onClick={() => handleAction(params.row.id, "likes")}>
							<ThumbUpIcon color="success" />
						</IconButton>
						<IconButton onClick={() => handleAction(params.row.id, "dislikes")}>
							<ThumbDownIcon color="error" />
						</IconButton>
					</Box>
				);
			},
		},
	];

	return (
		<Box m="1.5rem 2.5rem">
			<Header title="Your Purchases" subtitle="Manage your purchases" />
			<CustomDataGrid
				isLoading={isLoading || !data}
				rows={data?.trainings || []}
				columns={columns}
				rowCount={data?.total || 0}
				page={page}
				setPage={setPage}
				setPageSize={setPageSize}
				setSort={setSort}
				pageSize={pageSize}
				toolbar={{ searchInput, setSearchInput, setSearch }}
			/>
		</Box>
	);
};

export default BoughtTrainings;
