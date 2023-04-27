import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CircularProgress,
	Collapse,
	Tooltip,
	Typography,
	alpha,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../../components/reusable/Header";
import DoNotDisturbOnOutlinedIcon from "@mui/icons-material/DoNotDisturbOnOutlined";
import BrowserNotSupportedIcon from "@mui/icons-material/BrowserNotSupported";
import {
	useApprovePostMutation,
	useDeletePostMutation,
	useGetPostsAdminQuery,
} from "../../redux/posts/postsApiSlice";
import { selectCurrentSearch } from "../../redux/searchState/searchSlice";
import { format } from "date-fns";
import UserAgreement from "../../components/reusable/UserAgreement";
import { useOutletContext } from "react-router-dom";
import { selectSocket } from "../../redux/socket/socketSlice";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { useCreateNotificationMutation } from "../../redux/notifications/notificationsApi";
import CustomSnack from "../../components/reusable/CustomSnack";

const Post = ({
	post,
	setDeleteId,
	setOpen,
	setApproveId,
	setApproveOpen,
	setSnackInfo,
}) => {
	const theme = useTheme();
	const [isExpanded, setIsExpanded] = useState(false);
	// const [deletePost] = useDeletePostMutation();
	const navigate = useNavigate();

	return (
		<Card
			sx={{
				backgroundImage: "none",
				backgroundColor: theme.palette.background.alt,
				borderRadius: "0.55rem",
			}}>
			<CardContent>
				<Typography
					sx={{ fontSize: 14 }}
					color={theme.palette.secondary[500]}
					gutterBottom>
					{post?.tags.map((t) => `${t} `)}
				</Typography>
				<Tooltip title="Click to see the post!" placement="bottom" arrow>
					<Typography
						variant="h5"
						color={theme.palette.secondary[300]}
						sx={{ cursor: "pointer", width: "fit-content" }}
						onClick={() => navigate(`/posts/find/${post?.id}`)}>
						{post?.title}
					</Typography>
				</Tooltip>
				<Typography sx={{ mb: "1.5rem" }} color={theme.palette.secondary[400]}>
					{post?.approved}
				</Typography>
				<Box display="flex" alignItems="center" justifyContent="space-around">
					<Typography color={theme.palette.secondary[200]} variant="body2">
						Likes: {post?.likes?.length}
					</Typography>
					<Typography variant="body2" color={theme.palette.secondary[200]}>
						Dislikes: {post?.dislikes?.length}
					</Typography>
				</Box>
			</CardContent>
			<CardActions>
				<Button
					variant="primary"
					size="small"
					onClick={() => setIsExpanded((prev) => !prev)}>
					{!isExpanded ? "See More" : "See Less"}
				</Button>
			</CardActions>
			<Collapse
				in={isExpanded}
				timeout="auto"
				unmountOnExit
				sx={{
					color: theme.palette.neutral[300],
				}}>
				<CardContent>
					<Box
						m={1}
						display={"flex"}
						justifyContent="space-start"
						gap={2}
						alignItems={"center"}
						width="100%">
						<Typography>id: </Typography>
						<Typography>{post?.id}</Typography>
					</Box>
					<Box
						m={1}
						display={"flex"}
						justifyContent="space-start"
						gap={2}
						alignItems={"center"}
						width="100%">
						<Typography>Author: </Typography>
						<Typography
							sx={{
								cursor: "pointer",
								"&:hover": { color: theme.palette.secondary[300] },
							}}
							onClick={() =>
								void navigate("/user/author", { state: post?.user?._id })
							}>
							{post?.user?.username}{" "}
						</Typography>
					</Box>
					<Box
						m={1}
						display={"flex"}
						justifyContent="space-start"
						gap={2}
						alignItems={"center"}
						width="100%">
						<Typography>CreatedAt:</Typography>
						<Typography>
							{format(new Date(post?.createdAt), "dd/MM/yyyy")}
						</Typography>
					</Box>
					<Box
						m={1}
						display={"flex"}
						justifyContent="space-start"
						gap={2}
						alignItems={"center"}
						width="100%">
						<Typography>UpdatedAt:</Typography>
						<Typography>
							{" "}
							{format(new Date(post?.updatedAt), "dd/MM/yyyy")}
						</Typography>
					</Box>
					<Box
						m={1}
						display={"flex"}
						justifyContent="space-start"
						gap={2}
						alignItems={"center"}
						width="100%">
						<Typography>Displayed:</Typography>
						<Typography
							sx={{
								color: post?.display
									? alpha(theme.palette.info.dark, 1)
									: theme.palette.warning.dark,
							}}>
							{post?.display ? "Displaying" : "Not displaying"}
						</Typography>
					</Box>
					<Box
						display="flex"
						width="100%"
						mt={2}
						justifyContent="space-between"
						alignItems="center">
						<Button
							color="error"
							onClick={() => {
								setSnackInfo((prev) => ({
									...prev,
									severity: "error",
									message: `${post?.title} deleted`,
									open: false,
								}));
								setDeleteId({ id: post?.id, user: post?.user?._id });
								setOpen((prev) => !prev);
							}}>
							DELETE
						</Button>
						{post?.user?.role !== "admin" && (
							<Button
								sx={{
									color: post?.approved
										? theme.palette.warning.main
										: theme.palette.success.main,
								}}
								onClick={() => {
									setSnackInfo((prev) => ({
										...prev,
										severity: !post?.approved ? "success" : "warning",
										message: `${post?.title} ${
											!post?.approved ? "approved" : "disapproved"
										}`,
										open: false,
									}));
									setApproveId({
										id: post?.id,
										state: !post?.approved,
										user: post?.user?._id,
									});
									setApproveOpen((prev) => !prev);
								}}>
								{post?.approved ? "Disapprove" : "Approve"}
							</Button>
						)}
					</Box>
				</CardContent>
			</Collapse>
		</Card>
	);
};

const AllPostsAdmin = () => {
	const search = useSelector(selectCurrentSearch);
	const isNonMobile = useMediaQuery("(min-width: 1000px)");
	const [limit, setLimit] = useState(20);
	const { palette } = useTheme();
	const [deletePost] = useDeletePostMutation();
	const [approvePost] = useApprovePostMutation();
	const [open, setOpen] = useState(false);
	const [deleteId, setDeleteId] = useState({ id: null, user: null });
	const [approveOpen, setApproveOpen] = useState(false);
	const [approveId, setApproveId] = useState({
		id: null,
		state: false,
		user: null,
	});
	const [notApproved, setNotApproved] = useState(false);
	const [notDisplayed, setNotDisplayed] = useState(false);
	const isNonSmallScreens = useMediaQuery("(min-width: 620px)");
	const isSideBarOpen = useOutletContext();
	const socketRedux = useSelector(selectSocket);
	const user = useSelector(selectCurrentUser);
	const [createNotification] = useCreateNotificationMutation();
	const [snackInfo, setSnackInfo] = useState({
		open: false,
		message: "",
		severity: "",
	});

	const handleDelete = async (id) => {
		if (deleteId?.id) {
			try {
				await deletePost({ id }).unwrap();
				if (socketRedux) {
					if (deleteId?.user !== user?.id) {
						const ob = {
							receiver: deleteId?.user,
							type: "post/delete",
							sender: user?.id,
							ref: deleteId.id,
						};
						socketRedux.emit("notifApproved", {
							...ob,
							receiverId: ob.receiver,
						});
						await createNotification(ob).unwrap();
					}
				}
				setTimeout(() => {
					setSnackInfo((prev) => ({ ...prev, open: true }));
				}, 1000);
			} catch (error) {
				console.log(error);
			}
		}
	};
	const handleApprove = async (id) => {
		if (approveId?.id) {
			try {
				await approvePost({ id }).unwrap();
				if (socketRedux) {
					const ob = {
						receiver: approveId?.user,
						type: approveId?.state ? "post/approve" : "post/disapprove",
						sender: user?.id,
						ref: approveId.id,
					};
					socketRedux.emit("notifApproved", {
						...ob,
						receiverId: ob.receiver,
					});
					await createNotification(ob).unwrap();
				}
				setTimeout(() => {
					setSnackInfo((prev) => ({ ...prev, open: true }));
				}, 1000);
			} catch (error) {
				console.log(error);
			}
		}
	};

	const { data, isLoading } = useGetPostsAdminQuery(
		{ search, limit, notApproved, notDisplayed },
		{
			refetchOnFocus: true,
		},
	);
	// console.log(data?.posts?.map(({ likes, dislikes }) => ({ likes, dislikes })));

	if (isLoading || !data || !socketRedux || !user?.id)
		return (
			<CircularProgress
				sx={{ position: "absolute", top: "50%", left: "50%" }}
				size="3rem"
				thickness={7}
			/>
		);
	return (
		<Box m="1.5rem 2.5rem" pb={2}>
			<CustomSnack
				open={snackInfo.open}
				setOpen={(arg) => setSnackInfo((prev) => ({ ...prev, open: arg }))}
				message={snackInfo.message}
				severity={snackInfo.severity}
			/>
			<UserAgreement
				open={open}
				setOpen={setOpen}
				title={"Confirm delete"}
				text={
					"Are you sure you want to delete this post? You can't undo after you press Agree, be careful what you want."
				}
				handleAgree={async () => await handleDelete(deleteId.id)}
			/>
			<UserAgreement
				open={approveOpen}
				setOpen={setApproveOpen}
				title={`Confirm ${approveId.state ? "approve" : "disapprove"}`}
				text={`Are you sure you want to ${
					approveId.state ? "approve" : "disapprove"
				} this post? Make sure you have read it!`}
				handleAgree={async () => await handleApprove(approveId.id)}
			/>
			<Box display={!isNonSmallScreens && isSideBarOpen ? "block" : "none"}>
				<Header
					title="Posts"
					subtitle={`See the list of ${
						notApproved ? "unapproved" : notDisplayed ? "undisplayed" : ""
					} posts.`}
				/>
			</Box>
			<Box display={!isNonSmallScreens && isSideBarOpen ? "none" : "block"}>
				<Box
					gap={2}
					display="flex"
					justifyContent={{ xs: "center", md: "space-between" }}
					width="100%"
					alignItems={{ xs: "space-between", md: "center" }}
					flexDirection={{ xs: "column", md: "row" }}>
					<Box flex={1}>
						<Header
							title="Posts"
							subtitle={`See the list of ${
								notApproved ? "unapproved" : notDisplayed ? "undisplayed" : ""
							} posts.`}
						/>
					</Box>
					<Box
						flex={0.5}
						display="flex"
						alignItems="center"
						gap={2}
						justifyContent="center">
						<Button
							sx={{
								bgcolor: palette.secondary[300],
								color: palette.background.default,
								width: 180,
								"&:hover": {
									color: palette.secondary[300],
									bgcolor: palette.background.default,
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

						<Button
							sx={{
								bgcolor: palette.secondary[300],
								color: palette.background.default,
								width: 180,
								"&:hover": {
									color: palette.secondary[300],
									bgcolor: palette.background.default,
								},
								"&:disabled": {
									bgcolor: palette.grey[500],
									color: palette.secondary[300],
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
				{data?.total === 0 && (
					<Typography
						fontSize={40}
						mt={6}
						fontWeight="bold"
						textAlign="center"
						color={palette.secondary[300]}>
						No posts meet the criteria
					</Typography>
				)}
				<Box
					mt="20px"
					display="grid"
					gridTemplateColumns="repeat(4,minmax(0, 1fr))"
					justifyContent="space-between"
					rowGap="20px"
					columnGap="1.33%"
					sx={{
						"& > div": {
							gridColumn: isNonMobile ? undefined : "span 4",
						},
					}}>
					{data?.posts.map((post) => (
						<Post
							key={post?.id}
							post={post}
							setDeleteId={setDeleteId}
							setOpen={setOpen}
							setApproveId={setApproveId}
							setApproveOpen={setApproveOpen}
							setSnackInfo={setSnackInfo}
						/>
					))}
				</Box>
				{data?.total > limit && (
					<Box display="flex" justifyContent="center" m={4} p={2}>
						<Button
							onClick={() => setLimit((prev) => prev + 20)}
							sx={{
								color: palette.background.default,
								bgcolor: palette.secondary[300],
								"&:hover": {
									color: palette.secondary[300],
									bgcolor: palette.primary.main,
								},
							}}>
							Load More
						</Button>
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default AllPostsAdmin;
