import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import { useRef, useState } from "react";
import IconBtn from "../reusable/IconBtn";
import MailIcon from "@mui/icons-material/Mail";
import { useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDeleteNotificationsByReceiverMutation } from "../../redux/notifications/notificationsApi";

export default function PopUp({ notifications, userId, setNotifications }) {
	const [open, setOpen] = useState(false);
	const ref = useRef(null);
	const theme = useTheme();
	const navigate = useNavigate();
	const [deleteByReceiver] = useDeleteNotificationsByReceiverMutation();
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

	if (!notifications) return <></>;
	console.log(notifications);

	const content = notifications?.map(({ createdAt, sender, type, ref }) => (
		<Typography
			key={createdAt}
			sx={{
				p: 2,
				cursor: "pointer",

				"&:hover": {
					bgcolor: theme.palette.background.alt,
				},
			}}
			textAlign="center"
			onClick={() => void navigate(`/messenger?conv=${ref}`)}>
			{`${sender?.username} ${type}`}
		</Typography>
	));

	return (
		<Box>
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
							{content}
							{notifications.length > 0 && (
								<Button onClick={(e) => handleClick(e)}>Close</Button>
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
