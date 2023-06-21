import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import {
	Button,
	CircularProgress,
	IconButton,
	Tooltip,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import { format } from "date-fns";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CustomDataGrid from "../../components/dataGrid/CustomDataGrid";
import Header from "../../components/reusable/Header";
import LootieCustom from "../../components/reusable/LootieCustom";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import {
	useGetBoughtUserTrainingsQuery,
	useTrainingActionsMutation,
} from "../../redux/trainings/trainingsApi";
import cantSee from "../../utils/lottie/cantSee.json";

const BoughtTrainings = () => {
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(20);
	const [sort, setSort] = useState({});
	const [search, setSearch] = useState("");
	const [searchInput, setSearchInput] = useState("");
	const { palette } = useTheme();
	const user = useSelector(selectCurrentUser);
	const isNonMobileScreens = useMediaQuery("(min-width: 1200px)");
	const navigate = useNavigate();

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
	console.log({ data });
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
			field: "title",
			headerName: "Title",
			// flex: 1,
			width: 150,
		},
		{
			field: "author",
			headerName: "Author",
			// flex: 1,
			width: 200,
			sortable: false,
			filterable: false,
			renderCell: ({
				row: {
					user: { username, _id },
				},
			}) => (
				<Tooltip title="Go to profile" arrow placement="top">
					<Typography
						fontSize={12.3}
						sx={{
							cursor: "pointer",
							"&:hover": { color: palette.secondary[300] },
						}}
						onClick={() => void navigate("/user/author", { state: _id })}>
						{username}
					</Typography>
				</Tooltip>
			),
		},
		{
			field: "createdAt",
			headerName: "CreatedAt",
			// flex: 1,
			width: 110,
			sortable: false,
			renderCell: ({ row: { createdAt } }) =>
				format(new Date(createdAt), "dd/MM/yyyy"),
		},
		{
			field: "updatedAt",
			headerName: "UpdatedAt",
			// flex: 1,
			width: 110,
			sortable: false,
			renderCell: ({ row: { updatedAt } }) =>
				format(new Date(updatedAt), "dd/MM/yyyy"),
		},
		{
			field: "exercises",
			headerName: "Exercises",
			// flex: 1,
			width: 80,
			sortable: false,
			filterable: false,
			renderCell: ({ row: { exercises } }) => exercises.length,
		},
		{
			field: "tags",
			headerName: "Tags",
			// flex: 2,
			width: 270,
			sortable: false,
			renderCell: ({ row: { tags } }) =>
				tags.reduce((acc, cur) => (acc += `${cur} `), ``),
		},
		{
			field: "action",
			headerName: "Actions",
			// flex: 2,
			width: 170,
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
							<Button
								variant="contained"
								size="small"
								className="cellBtn"
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

	if (data && !data?.exists) {
		return (
			<LootieCustom
				lootie={cantSee}
				link={"/trainings"}
				btnText="Go Shopping"
				replace={false}
				title="No bought trainings were found :("
			/>
		);
	}
	return (
		<Box m="1.5rem 2.5rem">
			<Header title="Your Purchases" subtitle="Manage your purchases" />
			<Box
				maxWidth={1700}
				display="flex"
				justifyContent="center"
				overflow="hidden"
				m="0 auto">
				<Box flex={isNonMobileScreens ? 0.95 : 1} maxWidth={1125}>
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
