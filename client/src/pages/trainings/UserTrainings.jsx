import { Button, Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CustomDataGrid from "../../components/dataGrid/CustomDataGrid";
import Header from "../../components/reusable/Header";
import UserAgreement from "../../components/reusable/UserAgreement";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import {
	useDeleteTrainingMutation,
	useGetUserTrainingsQuery,
} from "../../redux/trainings/trainingsApi";

const Trainings = () => {
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(20);
	const [sort, setSort] = useState({});
	const [search, setSearch] = useState("");
	const [searchInput, setSearchInput] = useState("");
	const [open, setOpen] = useState(false);
	const [deleteId, setDeleteId] = useState(null);
	const user = useSelector(selectCurrentUser);

	const { data, isLoading } = useGetUserTrainingsQuery(
		{
			userId: user?.id,
			page,
			pageSize,
			sort: JSON.stringify(sort),
			search,
		},
		{ skip: !user?.id },
	);
	const [deleteTraining] = useDeleteTrainingMutation();
	const handleDeleteTraining = async (id) => {
		try {
			await deleteTraining({ id }).unwrap();
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
					<Box sx={{ width: "100%", display: "flex", gap: 1 }}>
						<Link
							to={`/trainings/find/${params.row.id}`}
							style={{ textDecoration: "none" }}>
							<Button variant="contained" size="small" className="cellBtn">
								View
							</Button>
						</Link>
						<Tooltip
							title={params.row?.occurrences > 0 ? "Bought" : ""}
							placement="right"
							arrow>
							<Box>
								<Button
									className="cellBtn"
									variant="contained"
									size="small"
									disabled={params.row?.occurrences > 0}
									onClick={() => {
										setDeleteId(params.row.id);
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

	return (
		<Box m="1.5rem 2.5rem">
			<UserAgreement
				open={open}
				setOpen={setOpen}
				title={"Confirm delete"}
				text={
					"Are you sure you want to delete this training? You can't undo after you press Agree, be careful what you want."
				}
				handleAgree={async () => await handleDeleteTraining(deleteId)}
			/>
			<Header title="Your Trainings" subtitle="Manage your trainings" />
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

export default Trainings;
