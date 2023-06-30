import MailIcon from "@mui/icons-material/Mail";
import { Tooltip, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Typography from "@mui/material/Typography";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setNotReload } from "../../redux/messages/messagesSlice";
import {
	useDeleteNotifcationsBySenderMutation,
	useDeleteNotificationsByReceiverMutation,
} from "../../redux/notifications/notificationsApi";
import IconBtn from "../reusable/IconBtn";

export default function PopUp({
	notifications,
	userId,
	setNotifications,
	approved,
	setApproved,
	portal,
	left,
}) {
	const [open, setOpen] = useState(false);
	const ref = useRef(null);
	const theme = useTheme();
	const navigate = useNavigate();
	const [deleteByReceiver] = useDeleteNotificationsByReceiverMutation();
	const [deleteBySender] = useDeleteNotifcationsBySenderMutation();
	const dispatch = useDispatch();
	const badgeContent =
		notifications?.length +
		Object.values(approved).reduce((acc, cur) => (acc += cur.length), 0);

	//when open the notification the count will be 0
	console.log({ notifications });

	const handleClick = (e) => {
		if (e) {
			(async () => {
				try {
					const ids = await deleteByReceiver({ receiverId: userId }).unwrap();
					console.log(ids);
				} catch (error) {
					console.log(error);
				}
			})();
			setNotifications([]);
			setApproved({
				postApprove: [],
				postDisapprove: [],
				postDelete: [],
				trainingApprove: [],
				trainingDisapprove: [],
				trainingDelete: [],
				trainingBought: [],
			});
		}
		setOpen((prev) => !prev);
	};

	const cont = useMemo(() => {
		if (notifications) {
			const parsed = notifications?.reduce((acc, cur) => {
				if (cur?.sender?._id && cur?.sender?.username && cur?.ref) {
					const { _id, username } = cur.sender;
					const ref = cur?.ref;
					acc[_id]
						? acc[_id].total++
						: (acc[_id] = { total: 1, user: username, ref });
				}
				return acc;
			}, {});
			const handleItemClick = (e, { _id }) => {
				if (e) {
					(async () => {
						try {
							const ids = await deleteBySender({ senderId: _id }).unwrap();
							console.log({ ids });
							setNotifications((prev) =>
								prev.filter(({ sender }) => sender._id !== _id),
							);
							console.log({ notifications });
						} catch (error) {
							console.log(error);
						}
					})();
				}
				setOpen((prev) => !prev);
			};

			return Object.entries(parsed).map(([key, { total, user, ref }]) => (
				<Box
					key={key}
					width="100%"
					display="flex"
					justifyContent="space-between"
					zIndex={100}
					alignItems="center"
					onClick={(e) => {
						handleItemClick(e, { _id: key });
						dispatch(setNotReload(true));
						navigate(`/messenger?conv=${ref}`);
					}}
					gap={1}
					sx={{
						cursor: "pointer",
						"&:hover": {
							bgcolor: theme.palette.background.alt,
						},
					}}
					p={2}>
					<Typography color={theme.palette.secondary[200]} fontWeight={900}>
						{total}
					</Typography>
					<Typography color={theme.palette.secondary[300]} textAlign="end">
						{`${total > 1 ? "messages" : "message"} from ${user}`}
					</Typography>
				</Box>
			));
		}
	}, [
		deleteBySender,
		dispatch,
		navigate,
		notifications,
		setNotifications,
		theme.palette.background.alt,
		theme.palette.secondary,
	]);
	useEffect(() => {
		if (badgeContent === 0) {
			setOpen(false);
		}
	}, [badgeContent]);
	// console.log({ parsed });

	if (
		!notifications ||
		!approved?.postApprove ||
		!approved?.postDisapprove ||
		!approved?.trainingApprove ||
		!approved?.trainingDisapprove ||
		!approved?.postDelete ||
		!approved?.trainingDelete ||
		!approved?.trainingBought
	)
		return <></>;

	return (
		<Box>
			<Popper
				disablePortal={portal}
				open={open}
				anchorEl={ref?.current}
				placement={left ? "left" : "bottom"}
				sx={{ p: left ? 2 : 0 }}
				transition>
				{({ TransitionProps }) => (
					<Fade {...TransitionProps} timeout={350}>
						<Paper
							sx={{
								zIndex: 10,
								// overflowY: "scroll",
								maxHeight: "80vh",
							}}>
							{/* {content} */}
							{badgeContent === 0 && (
								<Box
									width="100%"
									display="flex"
									justifyContent="center"
									flexDirection="column"
									alignItems="center"
									mt={0.5}
									px={2}
									pt={2}>
									<Typography
										color={theme.palette.secondary[200]}
										fontWeight={800}
										fontSize={16}>
										No notifications
									</Typography>
								</Box>
							)}
							{cont}
							<Box
								width="100%"
								display="flex"
								justifyContent="center"
								flexDirection="column"
								alignItems="center"
								mt={0.5}
								gap={1}
								pb={
									approved?.postApprove.length > 0 ||
									approved?.postDisapprove.length > 0 ||
									approved?.postDelete.length > 0
										? 1
										: 0
								}
								sx={{
									cursor: "pointer",
									"&:hover": {
										bgcolor: theme.palette.background.alt,
									},
								}}
								onClick={() => navigate("/posts/user")}>
								{approved?.postApprove.length > 0 && (
									<Box
										width="100%"
										display="flex"
										justifyContent="space-between"
										alignItems="center"
										pt={2}
										px={2}
										gap={1}>
										<Typography
											color={theme.palette.secondary[200]}
											fontWeight={900}>
											{approved?.postApprove.length}{" "}
										</Typography>
										<Typography
											color={theme.palette.secondary[300]}
											textAlign="end">
											{approved?.postApprove.length > 1 ? "Posts" : "Post"}{" "}
											Approved
										</Typography>{" "}
									</Box>
								)}
								{approved?.postDisapprove.length > 0 && (
									<Box
										width="100%"
										display="flex"
										justifyContent="space-between"
										alignItems="center"
										gap={1}
										pt={2}
										px={2}>
										<Typography
											color={theme.palette.secondary[200]}
											fontWeight={900}>
											{approved?.postDisapprove.length}
										</Typography>
										<Typography
											color={theme.palette.secondary[300]}
											textAlign="end">
											{approved?.postDisapprove.length > 1 ? "Posts" : "Post"}{" "}
											Disapproved
										</Typography>
									</Box>
								)}
								{approved?.postDelete.length > 0 && (
									<Box
										width="100%"
										display="flex"
										justifyContent="space-between"
										alignItems="center"
										gap={1}
										pt={2}
										px={2}>
										<Typography
											color={theme.palette.secondary[200]}
											fontWeight={900}>
											{approved?.postDelete.length}
										</Typography>
										<Typography
											color={theme.palette.secondary[300]}
											textAlign="end">
											{approved?.postDelete.length > 1 ? "Posts" : "Post"}{" "}
											Deleted
										</Typography>
									</Box>
								)}
							</Box>
							<Box
								width="100%"
								display="flex"
								justifyContent="center"
								flexDirection="column"
								alignItems="center"
								mt={1}
								pb={
									approved?.trainingApprove.length > 0 ||
									approved?.trainingDisapprove.length > 0 ||
									approved?.trainingDelete.length > 0
										? 1
										: 0
								}
								gap={1}
								// p={2}
								sx={{
									cursor: "pointer",
									"&:hover": {
										bgcolor: theme.palette.background.alt,
									},
								}}
								onClick={() => navigate("/trainings/user")}>
								{approved?.trainingApprove.length > 0 && (
									<Box
										width="100%"
										display="flex"
										justifyContent="space-between"
										alignItems="center"
										pt={2}
										px={2}
										gap={1}>
										<Typography
											color={theme.palette.secondary[200]}
											fontWeight={900}>
											{approved?.trainingApprove.length}{" "}
										</Typography>
										<Typography
											color={theme.palette.secondary[300]}
											textAlign="end">
											{approved?.trainingApprove.length > 1
												? "Trainings"
												: "Training"}{" "}
											Approved
										</Typography>{" "}
									</Box>
								)}
								{approved?.trainingDisapprove.length > 0 && (
									<Box
										width="100%"
										display="flex"
										justifyContent="space-between"
										alignItems="center"
										px={2}
										pt={2}
										gap={1}>
										<Typography
											color={theme.palette.secondary[200]}
											fontWeight={900}>
											{approved?.trainingDisapprove.length}
										</Typography>
										<Typography
											color={theme.palette.secondary[300]}
											textAlign="end">
											{approved?.trainingDisapprove.length > 1
												? "Trainings"
												: "Training"}{" "}
											Disapproved
										</Typography>
									</Box>
								)}
								{approved?.trainingDelete.length > 0 && (
									<Box
										width="100%"
										display="flex"
										justifyContent="space-between"
										alignItems="center"
										px={2}
										pt={2}
										gap={1}>
										<Typography
											color={theme.palette.secondary[200]}
											fontWeight={900}>
											{approved?.trainingDelete.length}
										</Typography>
										<Typography
											color={theme.palette.secondary[300]}
											textAlign="end">
											{approved?.trainingDelete.length > 1
												? "Trainings"
												: "Training"}{" "}
											Deleted
										</Typography>
									</Box>
								)}
								{approved?.trainingBought.length > 0 && (
									<Box
										width="100%"
										display="flex"
										justifyContent="space-between"
										alignItems="center"
										px={2}
										pt={2}
										gap={1}>
										<Typography
											color={theme.palette.secondary[200]}
											fontWeight={900}>
											{approved?.trainingBought.length}
										</Typography>
										<Typography
											color={theme.palette.secondary[300]}
											textAlign="end">
											{approved?.trainingBought.length > 1
												? "Trainings"
												: "Training"}{" "}
											Bought
										</Typography>
									</Box>
								)}
							</Box>
							{/* {approved?.trainingApprove.length > 0 && (
								<Typography>
									{approved?.trainingApprove.length} trainings app
								</Typography>
							)}
							{approved?.trainingApprove.length > 0 && (
								<Typography>
									{approved?.trainingApprove.length} trainings app
								</Typography>
							)} */}
							{badgeContent > 0 && (
								<Tooltip title="Notifications will be deleted" arrow>
									<Button
										sx={{
											color: theme.palette.secondary[500],
											"&:hover": {
												color: theme.palette.primary.main,
											},
										}}
										onClick={(e) => handleClick(e)}>
										Clear
									</Button>
								</Tooltip>
							)}
						</Paper>
					</Fade>
				)}
			</Popper>

			<Box
				ref={ref}
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					zIndex: 102,
				}}>
				<IconBtn
					badgeContent={badgeContent || 0}
					///badgeContent={notifications}
					icon={<MailIcon />}
					onClick={handleClick}
				/>
			</Box>
		</Box>
	);
}
