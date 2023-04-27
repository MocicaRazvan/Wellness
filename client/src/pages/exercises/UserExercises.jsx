import { Box, Button, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { format } from "date-fns";
import {
	useDeleteExerciseMutation,
	useGetUsersExercisesQuery,
} from "../../redux/exercises/exercisesApi";
import Header from "../../components/reusable/Header";
import UserAgreement from "../../components/reusable/UserAgreement";
import CustomDataGrid from "../../components/dataGrid/CustomDataGrid";
import LootieCustom from "../../components/reusable/LootieCustom";
import cantSee from "../../utils/lottie/cantSee.json";
import CustomSnack from "../../components/reusable/CustomSnack";

const UserExercises = () => {
	const { state, pathname } = useLocation();
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(20);
	const [sort, setSort] = useState({});
	const [search, setSearch] = useState("");
	const [searchInput, setSearchInput] = useState("");
	const user = useSelector(selectCurrentUser);
	const [open, setOpen] = useState(false);
	const [deleteId, setDeleteId] = useState({ id: null, title: "" });
	const isNonMobileScreens = useMediaQuery("(min-width: 1200px)");
	const { palette } = useTheme();
	const [snackOpen, setSnackOpen] = useState(state?.open || false);
	const [deleteOpen, setDeleteOpen] = useState(false);
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
			setTimeout(() => {
				setDeleteOpen(true);
			}, 1000);
		} catch (error) {
			console.log(error);
		}
	};
	const columns = [
		{
			field: "title",
			headerName: "Title",
			// flex: 1,
			width: 180,
		},
		{
			field: "createdAt",
			headerName: "CreatedAt",
			// flex: 0.7,
			width: 150,
			sortable: false,
			renderCell: ({ row: { createdAt } }) =>
				format(new Date(createdAt), "dd/MM/yyyy"),
		},

		{
			field: "updatedAt",
			headerName: "UpdatedAt",
			// flex: 0.7,
			width: 150,
			sortable: false,
			renderCell: ({ row: { updatedAt } }) =>
				format(new Date(updatedAt), "dd/MM/yyyy"),
		},
		{
			field: "occurrences",
			headerName: "Times Used",
			width: 110,
			sortable: false,
		},
		{
			field: "videos",
			headerName: "Videos",
			width: 85,
			sortable: false,
			filterable: false,
			renderCell: ({ row: { videos } }) => videos.length,
		},
		{
			field: "muscleGroups",
			headerName: "MuscleGroups",
			// flex: 2,
			width: 340,
			sortable: false,
			renderCell: ({ row: { muscleGroups } }) => (
				<Box>
					<div
						dangerouslySetInnerHTML={{
							__html: muscleGroups.reduce((acc, cur, i, arr) => {
								if (arr.length === 1) {
									acc += `<div>${cur}</div>`;
								} else if (i % 5 === 4 || i === arr.length - 1) {
									acc += `${cur} `;
									acc += `</div>`;
								} else if (i % 5 === 0) {
									acc += `<div>`;
									acc += `${cur} `;
								} else {
									acc += `${cur} `;
								}
								return acc;
							}, ``),
						}}
					/>
				</Box>
			),
		},
		{
			field: "action",
			headerName: "Actions",
			// flex: 2,
			width: 260,
			sortable: false,
			filterable: false,
			renderCell: (params) => {
				return (
					<Box sx={{ width: "100%", display: "flex", gap: 1 }}>
						<Link
							to={`/exercises/find/${params.row.id}`}
							style={{ textDecoration: "none" }}>
							<Button
								variant="contained"
								size="small"
								sx={{
									color: palette.secondary[300],
									bgcolor: palette.background.default,

									"&:hover": {
										bgcolor: palette.secondary[300],
										color: palette.background.default,
									},
								}}>
								View
							</Button>
						</Link>
						<Link
							to={`/exercises/update/${params.row.id}`}
							style={{ textDecoration: "none" }}>
							<Button
								variant="contained"
								size="small"
								sx={{
									color: palette.secondary[300],
									bgcolor: palette.success.dark,
									"&:hover": {
										bgcolor: palette.secondary[300],
										color: palette.success.dark,
									},
								}}>
								Update
							</Button>
						</Link>
						<Tooltip
							title={params.row?.occurrences > 0 ? "Used" : ""}
							placement="right"
							arrow>
							<Box>
								<Button
									sx={{
										color: palette.secondary[300],
										bgcolor: palette.error.dark,
										"&:hover": {
											bgcolor: palette.secondary[300],
											color: palette.error.dark,
										},
									}}
									variant="contained"
									size="small"
									disabled={params.row?.occurrences > 0}
									onClick={() => {
										setDeleteId({ id: params.row.id, title: params.row.title });
										setOpen(true);
									}}>
									Delete
								</Button>
							</Box>
						</Tooltip>
					</Box>
				);
			},
		},
	];
	console.log({ data });
	if (data?.exercises?.length === 0) {
		return (
			<LootieCustom
				lootie={cantSee}
				link={"/exercises/create"}
				btnText="Start Creating"
				replace={false}
				title="No exercises were found :("
			/>
		);
	}

	return (
		<Box m="1.5rem 2.5rem">
			<CustomSnack
				open={snackOpen}
				setOpen={setSnackOpen}
				message={state?.message || ""}
				severity={state?.severity}
				pathname={pathname}
			/>
			<CustomSnack
				open={deleteOpen}
				setOpen={setDeleteOpen}
				message={`${deleteId.title} exercise deleted`}
				severity={"error"}
			/>
			<UserAgreement
				open={open}
				setOpen={setOpen}
				title={"Confirm delete"}
				text={
					"Are you sure you want to delete this exercise? You can't undo after you press Agree, be careful what you want."
				}
				handleAgree={async () => await handleDeleteExercise(deleteId.id)}
			/>
			<Header title="Your Exercises" subtitle="Manage your exercises" />
			<Box
				maxWidth={1700}
				display="flex"
				justifyContent="center"
				overflow="hidden"
				m="0 auto">
				<Box flex={isNonMobileScreens ? 0.91 : 1} maxWidth={1350}>
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
			</Box>
		</Box>
	);
};

export default UserExercises;
