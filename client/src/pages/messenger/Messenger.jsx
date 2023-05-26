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
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import Conversation from "../../components/messenger/Conversation";
import Message from "../../components/messenger/Message";
import CustomSnack from "../../components/reusable/CustomSnack";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { useGetConversationsByUserQuery } from "../../redux/conversation/conversationApi";
import {
	useCreateMessageMutation,
	useGetMessagesByConversationQuery,
} from "../../redux/messages/messagesApi";
import {
	useCreateNotificationMutation,
	useDeleteNotifcationsBySenderMutation,
} from "../../redux/notifications/notificationsApi";
import { selectCurrentSearch } from "../../redux/searchState/searchSlice";
import useQuery from "../../utils/hooks/useQuery";

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
	const dispatch = useDispatch();
	const [searchParams, setSearchParams] = useSearchParams();
	const search = useSelector(selectCurrentSearch);
	const [userMounted, setUserMounted] = useState([]);
	const [focused, setFocused] = useState(false);
	const navigate = useNavigate();
	const [deleteConv, setDeleteConv] = useState({
		message: "",
		open: false,
		severity: "error",
	});

	const quryParams = new URLSearchParams();
	// console.log({ c: !query.get("conv"), q: quryParams.get("conv"), query });

	const { data: conversations, isLoading } = useGetConversationsByUserQuery(
		{ id: user?.id, search },
		{
			skip,
			pollingInterval: 100000,
			refetchOnFocus: true,
			refetchOnMountOrArgChange: true,
			refetchOnReconnect: true,
		},
	);
	const [deleteBySender] = useDeleteNotifcationsBySenderMutation();

	const [createMessage] = useCreateMessageMutation();
	const [createNotification] = useCreateNotificationMutation();

	const { data: dataMessages, isLoading: isLoadingMessages } =
		useGetMessagesByConversationQuery(
			{ id: currentChat?.id || null },
			{
				skip: skipMessages,
				pollingInterval: 10000,
				refetchOnMountOrArgChange: true,
				refetchOnFocus: true,
			},
		);

	useEffect(() => {
		if (!query.get("conv")) {
			setCurrentChat(null);
		}
	}, [query]);

	useEffect(() => {
		if (user?.role === "admin") {
			socket?.current?.on("getUsers", (users) => {
				console.log({ users });
				const mounted = users.reduce((acc, cur) => {
					if (cur?.mounted && cur?.role !== "admin") {
						acc.push(cur?.userId);
					}
					return acc;
				}, []);

				setUserMounted(mounted);
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user?.role, user?.id, socket?.current]);

	useEffect(() => {
		if (conversations) {
			const conv = conversations.find(({ id }) => id === query.get("conv"));
			if (conv) {
				setCurrentChat(conv);
			}
		}
	}, [conversations, query]);

	// useEffect(() => {
	// 	if (user?.role !== "admin" && query.get("conv") && conversations) {
	// 		if (conversations?.find(({ _id }) => _id === query.get("conv"))) {
	// 			navigate("/error");
	// 		}
	// 	}
	// }, [conversations, navigate, query, user?.role]);
	// console.log({ conversations });

	useEffect(() => {
		if (
			user?.id &&
			user?.role !== "admin" &&
			socket?.current !== undefined &&
			currentChat
		) {
			if (currentChat) {
				const senderId = currentChat?.members.find(
					({ _id }) => _id !== user?.id,
				)?._id;

				(async () => {
					try {
						senderId && (await deleteBySender({ senderId }).unwrap());

						// dispatch(addSenderId(senderId));
					} catch (error) {
						console.log(error);
					}
				})();
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		currentChat,
		deleteBySender,
		dispatch,
		user?.id,
		user?.role,
		socket?.current,
	]);

	useEffect(() => {
		// console.log({
		// 	c: user?.id && user?.role === "admin" && socket?.current !== undefined,
		// });
		if (user?.id && user?.role === "admin" && socket?.current !== undefined) {
			if (currentChat) {
				socket.current.emit("mountUserConv", {
					convId: currentChat?.id,
					userId: user?.id,
					role: user?.role,
				});
				const senderId = currentChat?.members.find(
					({ _id }) => _id !== user?.id,
				)?._id;

				(async () => {
					try {
						senderId && (await deleteBySender({ senderId }).unwrap());

						// dispatch(addSenderId(senderId));
					} catch (error) {
						console.log(error);
					}
				})();
			} else {
				socket.current.emit("mountUserConv", {
					convId: "conversatieInexistenta",
					userId: user?.id,
					role: user?.role,
				});
			}
		}
		return () => {
			if (user?.role === "admin" && socket?.current !== undefined) {
				socket.current.emit("mountUserConv", {
					convId: "conversatieInexistenta",
					userId: user?.id,
					role: user?.role,
				});
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		currentChat,
		deleteBySender,
		dispatch,
		user?.id,
		user?.role,
		socket?.current,
	]);

	useEffect(() => {
		if (user?.role !== "admin" && conversations) {
			setCurrentChat(conversations[0]);
			setSearchParams({ conv: conversations[0].id });
		}
		///!!!
	}, [conversations, setSearchParams, user?.role]);

	useEffect(() => {
		if (dataMessages) setMessages(dataMessages);
	}, [dataMessages]);

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
				id: Math.random() + new Date().getTime(),
			});
		});
	}, [mounted, ws]);

	useEffect(() => {
		if (arrivalMessage) {
			const ids = currentChat?.members?.map(({ _id }) => _id);
			console.log({ ids });
			ids?.includes(arrivalMessage.sender) &&
				setMessages((prev) => {
					if (prev) {
						return [...prev, arrivalMessage];
					} else {
						return [arrivalMessage];
					}
				});
			setArrivalMessage(null);
		}
		// arrivalMessage &&
		// 	currentChat?.members.includes(arrivalMessage.sender) &&
		// 	setMessages((prev) => [...prev, arrivalMessage]);
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
			({ _id }) => _id !== user?.id,
		)?._id;
		console.log({ receiverId });

		socket.current.emit("sendMessage", {
			senderId: user?.id,
			receiverId,
			text: newMessage,
		});

		console.log("message sent");
		//once
		socket?.current.once("getPartener", (data) => {
			console.log({ data });
			// console.log({ c: data?.curConv });
			const isAdminConv =
				data?.curConv?.convId !== currentChat.id &&
				data?.curConv?.role === "admin";
			const isAdminNotMounted = !data?.curConv && data?.user?.role === "admin";

			const nm = data?.user?.role !== "admin" && !data?.user?.mounted;
			// console.log({ nm });

			// console.log({ user: data?.user, conv: data?.curConv });
			// // console.log({ nm: mounted, isAdminConv, isAdminNotMounted });
			// console.log({ data });
			// console.log({ id: currentChat.id });
			// console.log({ isAdminConv, isAdminNotMounted });
			// console.log(!data?.user?.mounted || isAdminConv || isAdminNotMounted);
			if (nm || isAdminConv || isAdminNotMounted) {
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

	if (!socket?.current) return;

	// console.log({ messages });

	return (
		<MessengerContainer>
			<CustomSnack
				open={deleteConv.open}
				setOpen={(arg) => setDeleteConv((prev) => ({ ...prev, open: arg }))}
				message={deleteConv.message}
				severity={deleteConv.severity}
			/>
			{user?.role === "admin" && (
				<ChatMenu id="chatMenu">
					<Button
						sx={{
							width: 80,
							color: !focused
								? theme.palette.error.main
								: theme.palette.success.main,
						}}
						onClick={() => setFocused((prev) => !prev)}>
						{focused ? "See info" : "Hide info"}
					</Button>
					<div className="chatMenuWrapper">
						{/* <input placeholder="Search for friends" className="chatMenuInput" /> */}
						{conversations.map((c, i) => (
							<div
								key={`conv-${i}-${Math.random()}-${user?.id}`}
								id={`${c?.id}`}>
								<Box
									sx={{
										borderRadius: 2,
										mx: { xs: 0.2, sm: 2 },
										my: 2,
										border:
											searchParams.get("conv") === c.id &&
											`1px solid ${theme.palette.secondary[100]}`,
									}}
									onClick={() => {
										// dispatch(setNotReload(true));
										// void navigate(`/messenger?conv=${c.id}`, { replace: true });
										setFocused(true);
										quryParams.set("conv", c?.id);

										setSearchParams(quryParams);
									}}>
									<Conversation
										conversation={c}
										currentUser={user}
										currentChat={currentChat}
										userMounted={userMounted}
										adminId={user?.id}
										setCurrentChat={setCurrentChat}
										focused={focused}
										setDeleteConv={setDeleteConv}
									/>
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
										<div
											key={m.id + indx + Math.random() + new Date().getTime()}
											ref={scrollRef}>
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
									onFocus={() => setFocused(true)}
									// onBlur={() => setFocused(false)}
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
	"& .chatMenuWrapper": {
		padding: 10,
		height: "100%",
		overflowY: "scroll",
	},
	"& .chatMenuInput": {
		width: "90%",
		padding: "10px 0",
		border: "none",
		outline: "none",
		borderBottom: `1px solid ${theme.palette.primary[200]}`,
	},
	[theme.breakpoints.down("sm")]: {
		"& .chatMenuWrapper": {
			padding: 0,
		},
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
	[theme.breakpoints.down("sm")]: {
		"& .chatBoxWrapper": {
			padding: 0,
		},
	},
}));
