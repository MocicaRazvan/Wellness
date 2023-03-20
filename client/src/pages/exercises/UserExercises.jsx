import {
	Box,
	Button,
	CircularProgress,
	Tooltip,
	useTheme,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CustomDataGrid from "../../dataGrid/CustomDataGrid";
import { selectCurrentUser } from "../../redux/auth/authSlice";

import {
	useDeleteExerciseMutation,
	useGetUsersExercisesQuery,
} from "../../redux/exercises/exercisesApi";
import Header from "../../components/reusable/Header";

const UserExercises = () => {
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(20);
	const [sort, setSort] = useState({});
	const [search, setSearch] = useState("");
	const [searchInput, setSearchInput] = useState("");
	const user = useSelector(selectCurrentUser);
	const [tool, setTool] = useState(false);
	const { data, isLoading } = useGetUsersExercisesQuery(
		{
			id: user?.id,
			page,
			pageSize,
			sort: JSON.stringify(sort),
			search,
		},
		{ skip: !user?.id },
	);
	const [deleteExercise] = useDeleteExerciseMutation();
	const handleDeleteExercise = async (id) => {
		try {
			await deleteExercise({ id }).unwrap();
		} catch (error) {
			console.log(error);
		}
	};
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
			field: "muscleGroups",
			headerName: "MuscleGroups",
			flex: 2,
		},
		{
			field: "action",
			headerName: "Actions",
			flex: 2,
			renderCell: (params) => {
				return (
					<Box sx={{ width: "100%", display: "flex", gap: 1 }}>
						<Link
							to={`/exercises/find/${params.row.id}`}
							style={{ textDecoration: "none" }}>
							<Button variant="contained" size="small" className="cellBtn">
								View
							</Button>
						</Link>
						<Link
							to={`/exercises/update/${params.row.id}`}
							style={{ textDecoration: "none" }}>
							<Button variant="contained" size="small" className="cellBtn">
								Update
							</Button>
						</Link>
						<Tooltip
							title={params.row?.occurrences > 0 ? "Used" : ""}
							placement="right"
							arrow>
							<Box>
								<Button
									className="cellBtn"
									variant="contained"
									size="small"
									disabled={params.row?.occurrences > 0}
									onClick={() => handleDeleteExercise(params.row.id)}>
									Delete
								</Button>
							</Box>
						</Tooltip>
					</Box>
				);
			},
		},
	];
	return (
		<Box m="1.5rem 2.5rem">
			<Header title="Your Exercises" subtitle="Manage your exercises" />
			<CustomDataGrid
				isLoading={isLoading || !data}
				rows={data?.exercises || []}
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

export default UserExercises;
