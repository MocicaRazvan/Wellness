import React, { useEffect } from "react";
import {
	Box,
	Button,
	CircularProgress,
	Divider,
	styled,
	TextField,
	Typography,
	useTheme,
} from "@mui/material";
import Conversation from "../../components/messenger/Conversation";
import Message from "../../components/messenger/Message";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { useGetConversationsByUserQuery } from "../../redux/conversation/conversationApi";
import { useState } from "react";
import {
	useCreateMessageMutation,
	useGetMessagesByConversationQuery,
} from "../../redux/messages/messagesApi";
import { useRef } from "react";
import { useCreateNotificationMutation } from "../../redux/notifications/notificationsApi";
import useQuery from "../../utils/hooks/useQuery";
import { useNavigate, useSearchParams } from "react-router-dom";

const Messenger = ({ ws, mounted, admin = false }) => {
	let query = useQuery();
	const user = useSelector(selectCurrentUser);
	const [skip, setSkip] = useState(true);
	const [currentChat, setCurrentChat] = useState(null);
	const [skipMessages, setSkipMessages] = useState(true);
	const [newMessage, setNewMessage] = useState("");
	const [arrivalMessage, setArrivalMessage] = useState(null);
	const [messages, setMessages] = useState([]);
	const socket = useRef();
	const scrollRef = useRef();
	// const navigate = useNavigate();
	const theme = useTheme();
	// const dispatch = useDispatch();
	const [searchParams, setSearchParams] = useSearchParams();

	const quryParams = new URLSearchParams();

	const { data: conversations, isLoading } = useGetConversationsByUserQuery(
		{ id: user?.id },
		{ skip, pollingInterval: 100000 },
	);

	const [createMessage] = useCreateMessageMutation();
	const [createNotification] = useCreateNotificationMutation();

	const { data: dataMessages, isLoading: isLoadingMessages } =
		useGetMessagesByConversationQuery(
			{ id: currentChat?.id },
			{
				skip: skipMessages,
				pollingInterval: 10000,
				refetchOnMountOrArgChange: true,
			},
		);

	useEffect(() => {
		if (conversations) {
			const conv = conversations.find(({ id }) => id === query.get("conv"));
			if (conv) {
				setCurrentChat(conv);
			}
		}
	}, [conversations, query]);

	useEffect(() => {
		if (user?.role !== "admin") {
			conversations && setCurrentChat(conversations[0]);
		}
	}, [conversations, user?.role]);

	useEffect(() => void setMessages(dataMessages), [dataMessages]);

	useEffect(() => void setSkip(false), []);

	useEffect(() => {
		if (currentChat) {
			setSkipMessages(false);
		} else {
			setSkipMessages(true);
		}
	}, [currentChat]);

	useEffect(
		() =>
			void scrollRef?.current?.scrollIntoView({
				behavior: "instant",
				block: "nearest",
			}),
		[messages],
	);

	useEffect(() => {
		socket.current = ws;
		socket.current.on("getMessage", (data) => {
			setArrivalMessage({
				sender: data.senderId,
				text: data.text,
				createdAt: new Date(),
			});
		});
	}, [mounted, ws]);

	useEffect(() => {
		arrivalMessage &&
			currentChat?.members.includes(arrivalMessage.sender) &&
			setMessages((prev) => [...prev, arrivalMessage]);
	}, [arrivalMessage, currentChat]);

	// if (notReload) return <></>;

	if (isLoading || isLoadingMessages || !conversations)
		return (
			<CircularProgress
				sx={{ position: "absolute", top: "50%", left: "50%" }}
				size="3rem"
				thickness={7}
			/>
		);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const body = {
			sender: user?.id,
			text: newMessage,
			conversation: currentChat.id,
		};
		console.log("submit");

		const receiverId = currentChat?.members.find(
			(member) => member !== user?.id,
		);

		socket.current.emit("sendMessage", {
			senderId: user?.id,
			receiverId,
			text: newMessage,
		});

		console.log("message sent");
		//once
		socket?.current.once("getPartener", (data) => {
			console.log(data);
			console.log(!data?.user?.mounted);
			if (!data?.user?.mounted) {
				(async () => {
					await createNotification({
						receiver: receiverId,
						sender: user?.id,
						type: "message",
						ref: currentChat?.id,
					});
				})();
				socket?.current.emit("notifiUnmounted", {
					receiverId,
					type: "message",
					sender: { _id: user?.id, username: user?.username },
					ref: currentChat?.id,
				});
			}
		});

		try {
			await createMessage(body).unwrap();
			//console.log(body);

			setNewMessage("");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<MessengerContainer>
			{user?.role === "admin" && (
				<ChatMenu>
					<div className="chatMenuWrapper">
						{/* <input placeholder="Search for friends" className="chatMenuInput" /> */}
						{conversations.map((c, i) => (
							<div key={`conv-${i}-${c.id}-${new Date().getTime()}`}>
								<Box
									sx={{
										borderRadius: 2,
										m: 2,
										border:
											searchParams.get("conv") === c.id &&
											`1px solid ${theme.palette.secondary[100]}`,
									}}
									key={c.id + i}
									onClick={() => {
										// dispatch(setNotReload(true));
										// void navigate(`/messenger?conv=${c.id}`, { replace: true });
										quryParams.set("conv", c?.id);

										setSearchParams(quryParams);
									}}>
									<Conversation conversation={c} currentUser={user} />
								</Box>
								{i !== conversations?.length - 1 && (
									<Divider sx={{ bgcolor: theme.palette.secondary[300] }} />
								)}
							</div>
						))}
					</div>
				</ChatMenu>
			)}
			<ChatBox>
				<div className="chatBoxWrapper">
					{currentChat ? (
						<>
							<div className="chatBoxTop">
								{messages?.length === 0 ? (
									<Typography
										fontSize={33}
										textAlign="center"
										fontWeight={600}
										color={theme.palette.secondary[300]}>
										Write your thoughts here
									</Typography>
								) : (
									messages?.map((m, indx) => (
										<div key={m.id + indx} ref={scrollRef}>
											<Message
												message={m}
												own={m?.sender === user?.id ? "true" : null}
											/>
										</div>
									))
								)}
							</div>
							<div className="chatBoxBottom">
								<TextField
									multiline
									minRows={4}
									id="outlined-multilined"
									placeholder="Write something..."
									sx={{ width: "80%" }}
									value={newMessage}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											(async () => {
												newMessage.trim() !== "" && (await handleSubmit(e));
											})();
										}
									}}
									onChange={(e) => void setNewMessage(e.target.value)}
								/>
								<Button
									variant="contained"
									color="secondary"
									disableElevation
									disabled={newMessage.trim() === ""}
									onClick={handleSubmit}>
									Send
								</Button>
							</div>
						</>
					) : (
						<Typography
							variant="sbutitle1"
							sx={{
								top: "30%",
								fontSize: 30,
								textAlign: "center",
								justifySelf: "center",
								alignSelf: "center",
								color: "secondary.main",
								cursor: "default",
								opacity: 0.5,
							}}>
							Open a conversation to start a chat
						</Typography>
					)}
				</div>
			</ChatBox>
		</MessengerContainer>
	);
};

export default Messenger;

const MessengerContainer = styled(Box)(({ theme }) => ({
	height: "80vh",
	display: "flex",
}));
const ChatMenu = styled(Box)(({ theme }) => ({
	flex: 2.5,
	"& .chatMenuWrapper": { padding: 10, height: "100%", overflowY: "scroll" },
	"& .chatMenuInput": {
		width: "90%",
		padding: "10px 0",
		border: "none",
		outline: "none",
		borderBottom: `1px solid ${theme.palette.primary[200]}`,
	},
}));
const ChatBox = styled(Box)(({ theme }) => ({
	flex: 4.5,
	"& .chatBoxWrapper": {
		padding: 10,
		height: "100%",
		display: "flex",
		flexDirection: "column",
		position: "realtive",
	},
	"& .chatBoxTop": {
		height: "100%",
		overflowY: "scroll",
		paddingRight: 5,
	},
	"& .chatBoxBottom": {
		marginTop: 5,
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
	},
}));
