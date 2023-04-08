import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import { useMemo, useRef, useState } from "react";
import IconBtn from "../reusable/IconBtn";
import MailIcon from "@mui/icons-material/Mail";
import { Tooltip, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
	useDeleteNotifcationsBySenderMutation,
	useDeleteNotificationsByReceiverMutation,
} from "../../redux/notifications/notificationsApi";
import { useDispatch } from "react-redux";
import { setNotReload } from "../../redux/messages/messagesSlice";

export default function PopUp({ notifications, userId, setNotifications }) {
	const [open, setOpen] = useState(false);
	const ref = useRef(null);
	const theme = useTheme();
	const navigate = useNavigate();
	const [deleteByReceiver] = useDeleteNotificationsByReceiverMutation();
	const [deleteBySender] = useDeleteNotifcationsBySenderMutation();
	const dispatch = useDispatch();
	//when open the notification the count will be 0

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
		}
		setOpen((prev) => !prev);
	};

	const cont = useMemo(() => {
		if (notifications) {
			const parsed = notifications?.reduce(
				(acc, { sender: { _id, username }, ref }) => {
					acc[_id]
						? acc[_id].total++
						: (acc[_id] = { total: 1, user: username, ref });
					return acc;
				},
				{},
			);
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

	// console.log({ parsed });

	if (!notifications) return <></>;

	// const cont = Object.entries(parsed).map(([key, { total, user }]) => (
	// 	<Box
	// 		key={key}
	// 		width="100%"
	// 		display="flex"
	// 		justifyContent="space-between"
	// 		alignItems="center"
	// 		onClick={(e) => {
	// 			handleItemClick(e, { _id: key });
	// 			dispatch(setNotReload(true));
	// 			navigate(`/messenger?conv=${ref}`);
	// 		}}
	// 		gap={1}
	// 		sx={{
	// 			cursor: "pointer",
	// 			"&:hover": {
	// 				bgcolor: theme.palette.background.alt,
	// 			},
	// 		}}
	// 		p={2}>
	// 		<Typography color={theme.palette.secondary[200]} fontWeight={900}>
	// 			{total}
	// 		</Typography>
	// 		<Typography color={theme.palette.secondary[300]} textAlign="end">
	// 			{`${total > 1 ? "messages" : "message"} from ${user}`}
	// 		</Typography>
	// 	</Box>
	// ));

	// const content = notifications?.map(({ createdAt, sender, type, ref }) => (
	// 	<Typography
	// 		key={createdAt}
	// 		sx={{
	// 			p: 2,
	// 			cursor: "pointer",
	// 			color: theme.palette.secondary[300],
	// 			"&:hover": {
	// 				bgcolor: theme.palette.background.alt,
	// 			},
	// 		}}
	// 		textAlign="center"
	// 		onClick={(e) => {
	// 			handleItemClick(e, sender);
	// 			dispatch(setNotReload(true));
	// 			navigate(`/messenger?conv=${ref}`);
	// 		}}>
	// 		{`${sender?.username} ${type}`}
	// 	</Typography>
	// ));

	return (
		<Box sx={{ zIndex: "100" }}>
			<Popper
				open={open}
				anchorEl={ref?.current}
				placement={"bottom"}
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
							{cont}
							{notifications.length > 0 && (
								<Tooltip title="Notifications will be deleted" arrow>
									<Button
										sx={{
											color: theme.palette.secondary[500],
											"&:hover": {
												color: theme.palette.background.alt,
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
				component={"span"}
				ref={ref}
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}>
				<IconBtn
					badgeContent={notifications?.length || 0}
					///badgeContent={notifications}
					icon={<MailIcon />}
					onClick={handleClick}
				/>
			</Box>
		</Box>
	);
}
