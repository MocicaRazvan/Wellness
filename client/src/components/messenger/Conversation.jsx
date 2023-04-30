import DeleteIcon from "@mui/icons-material/Delete";
import TimelineDot from "@mui/lab/TimelineDot";
import {
	alpha,
	Box,
	IconButton,
	styled,
	Tooltip,
	Typography,
	useTheme,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import blankUser from "../../images/profile/blank-profile-picture-g212f720fb_640.png";
import { useDeleteSupportConversationMutation } from "../../redux/conversation/conversationApi";
import { selectNotifications } from "../../redux/notifications/notificationsSlice";
import { selectSocket } from "../../redux/socket/socketSlice";
import UserAgreement from "../reusable/UserAgreement";

const Conversation = ({
	conversation,
	currentUser,
	currentChat,
	userMounted,
	adminId,
	setCurrentChat,
	focused,
	setDeleteConv,
}) => {
	const { palette } = useTheme();
	// const { data: user } = useGetUserByIdQuery({
	// 	id: conversation?.members?.find((m) => m !== currentUser.id),
	// });
	const user = conversation?.members?.find(({ _id }) => _id !== currentUser.id);
	const amountNotif = useSelector(selectNotifications);
	const [isMounted, setIsMounted] = useState(true);
	const [open, setOpen] = useState(false);
	const [deleteConversation] = useDeleteSupportConversationMutation();
	const navigate = useNavigate();
	const [dot, setDot] = useState(false);
	const ref = useRef(null);
	const socketRedux = useSelector(selectSocket);

	useEffect(() => {
		setIsMounted(userMounted.includes(user?._id));
	}, [conversation?._id, currentChat?._id, user?._id, userMounted]);

	useEffect(() => {
		const scrollElem = document.getElementById(`${conversation?.id}`);
		if (scrollElem?.id === currentChat?.id) {
			scrollElem.scrollIntoView({
				behavior: "instant",
				block: "nearest",
				inline: "nearest",
			});
		}
	});

	useEffect(() => {
		(async () =>
			await new Promise((resolve) => setTimeout(resolve, 100)).then(() => {
				setDot(isMounted);
				ref.current = isMounted;
			}))();
	}, [isMounted, focused]);

	const handleDelteConversation = async () => {
		setDeleteConv((prev) => ({ ...prev, open: false }));
		try {
			socketRedux.emit("DelNotif", {
				convId: conversation.id,
				receiverId: user?._id,
			});
			await deleteConversation({ id: conversation?._id }).unwrap();
			setDeleteConv((prev) => ({
				...prev,
				open: true,
				message: `Conversation with ${user?.username} deleted`,
			}));
			console.log("delnotif");

			setCurrentChat(null);
			navigate("/messenger", { replace: true });
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<ConversationWrapper>
			<Box
				onClick={(e) => {
					e.stopPropagation();
				}}>
				<UserAgreement
					open={open}
					setOpen={setOpen}
					title={"Confirm delete"}
					text={
						"Are you sure you want to delete this conversation? You can't undo after you press Agree, be careful what you want."
					}
					handleAgree={async () => await handleDelteConversation()}
				/>
			</Box>
			<img
				src={user?.image?.url || blankUser}
				alt=""
				className="conversationImg"
			/>
			<Typography
				variant="body1"
				fontWeight="bold"
				color={palette.secondary[300]}>
				{user?.username}
			</Typography>

			<Box
				display="flex"
				alignItems="center"
				justifyContent="end"
				flex={1}
				sx={{ cursor: "default" }}
				onClick={(e) => {
					e.stopPropagation();
				}}
				gap={2}>
				{amountNotif[conversation.id] && (
					<Typography
						variant="body1"
						fontWeight="bold"
						sx={{ textAlign: "end", flex: 1, color: palette.secondary[200] }}>
						{amountNotif[conversation.id]}
					</Typography>
				)}
				{/* <Button
					sx={{ zIndex: 5 }}
					disabled={dot}
					onClick={(e) => {
						e.stopPropagation();
						setOpen(true);
						// (async () => await deleteConversation({ id: conversation?._id }))();
					}}>
					Delete conv
				</Button> */}
				{!focused && (
					<>
						<Tooltip
							title={!ref.current ? "Delete" : ""}
							color="error"
							arrow
							placement="top">
							<IconButton
								sx={{ zIndex: 5 }}
								disabled={ref.current}
								onClick={(e) => {
									e.stopPropagation();
									setOpen(true);
									// (async () => await deleteConversation({ id: conversation?._id }))();
								}}>
								<DeleteIcon />
							</IconButton>
						</Tooltip>
						<TimelineDot
							sx={{
								bgcolor: ref.current
									? palette.success.main
									: palette.error.main,
							}}
						/>
					</>
				)}
			</Box>
		</ConversationWrapper>
	);
};

export default Conversation;

const ConversationWrapper = styled(Box)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	padding: 10,
	gap: 20,
	margin: 10,
	":hover": { backgroundColor: alpha(theme.palette.primary.main, 0.35) },
	cursor: "pointer",
	"& .conversationImg": {
		width: 40,
		height: 40,
		borderRadius: "50%",
		objectFit: "cover",
	},
}));
