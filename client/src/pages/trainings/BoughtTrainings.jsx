import {
	Button,
	CircularProgress,
	IconButton,
	useMediaQuery,
	useTheme,
} from "@mui/material";
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
import { format } from "date-fns";

const BoughtTrainings = () => {
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(20);
	const [sort, setSort] = useState({});
	const [search, setSearch] = useState("");
	const [searchInput, setSearchInput] = useState("");
	const { palette } = useTheme();
	const user = useSelector(selectCurrentUser);
	const isNonMobileScreens = useMediaQuery("(min-width: 1200px)");

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
			// flex: 1,
			width: 220,
		},
		{
			field: "title",
			headerName: "Title",
			// flex: 1,
			width: 150,
		},
		{
			field: "user",
			headerName: "user ID",
			// flex: 1,
			width: 220,
		},
		{
			field: "createdAt",
			headerName: "CreatedAt",
			// flex: 1,
			width: 120,
			sortable: false,
			renderCell: ({ row: { createdAt } }) =>
				format(new Date(createdAt), "dd/MM/yyyy"),
		},
		{
			field: "tags",
			headerName: "Tags",
			// flex: 2,
			width: 270,
		},
		{
			field: "action",
			headerName: "Actions",
			// flex: 2,
			width: 210,
			sortable: false,
			filterable: false,
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
							<ThumbUpIcon
								sx={{
									color: params.row.likes.includes(user?.id)
										? palette.secondary[300]
										: palette.success.main,
								}}
							/>
						</IconButton>
						<IconButton onClick={() => handleAction(params.row.id, "dislikes")}>
							<ThumbDownIcon
								sx={{
									color: params.row.dislikes.includes(user?.id)
										? palette.secondary[300]
										: palette.error.main,
								}}
							/>
						</IconButton>
					</Box>
				);
			},
		},
	];

	return (
		<Box m="1.5rem 2.5rem">
			<Header title="Your Purchases" subtitle="Manage your purchases" />
			<Box
				maxWidth={1700}
				display="flex"
				justifyContent="center"
				overflow="hidden"
				m="0 auto">
				<Box flex={isNonMobileScreens ? 0.95 : 1} maxWidth={1220}>
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
			</Box>
		</Box>
	);
};

export default BoughtTrainings;
