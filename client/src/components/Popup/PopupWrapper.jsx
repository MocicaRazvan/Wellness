import React, { useEffect, useState } from "react";
import PopUp from "./Popup";
import { useDispatch, useSelector } from "react-redux";
import { selectSocket } from "../../redux/socket/socketSlice";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import {
	useDeleteApprovedMutation,
	useGetNotificationsByUserQuery,
} from "../../redux/notifications/notificationsApi";
import {
	addSenderId,
	selectSenderNotification,
	setNotificationsRedux,
} from "../../redux/notifications/notificationsSlice";
import { useLocation } from "react-router-dom";

const PopupWrapper = ({ portal = false, left = false }) => {
	const socketRedux = useSelector(selectSocket);
	const [skip, setSkip] = useState(true);
	const user = useSelector(selectCurrentUser);
	const [notifications, setNotifications] = useState([]);
	const [approved, setApproved] = useState({
		postApprove: [],
		postDisapprove: [],
		postDelete: [],
		trainingApprove: [],
		trainingDisapprove: [],
		trainingDelete: [],
		trainingBought: [],
	});
	const senderId = useSelector(selectSenderNotification);
	const disaptch = useDispatch();
	// const messages = useSelector(selectMessageNotification);
	// const dispatch = useDispatch();
	const { pathname } = useLocation();

	const { data, isLoading } = useGetNotificationsByUserQuery(
		{ receiverId: user?.id },
		{ skip, refetchOnMountOrArgChange: true, refetchOnReconnect: true },
	);
	const [deleteApproved] = useDeleteApprovedMutation();

	// console.log(notifications);

	useEffect(() => {
		if (user?.id) void setSkip(false);
	}, [user?.id]);
	useEffect(() => {
		if (data?.notifications) setNotifications(data?.notifications);
	}, [data?.notifications]);

	useEffect(() => {
		if (
			[
				data?.postApprove,
				data?.postDisapprove,
				data?.postDelete,
				data?.trainingApprove,
				data?.trainingDisapprove,
				data?.trainingDelete,
				data?.trainingBought,
			].every(Boolean)
		) {
			setApproved({
				postApprove: data?.postApprove,
				postDisapprove: data?.postDisapprove,
				postDelete: data?.postDelete,
				trainingApprove: data?.trainingApprove,
				trainingDisapprove: data?.trainingDisapprove,
				trainingDelete: data?.trainingDelete,
				trainingBought: data?.trainingBought,
			});
		}
	}, [
		data?.postApprove,
		data?.postDelete,
		data?.postDisapprove,
		data?.trainingApprove,
		data?.trainingBought,
		data?.trainingDelete,
		data?.trainingDisapprove,
	]);

	useEffect(() => {
		if (pathname === "/posts/user") {
			(async () => {
				try {
					await deleteApproved({ type: "post" }).unwrap();

					setApproved((prev) => ({
						...prev,
						postApprove: [],
						postDisapprove: [],
						postDelete: [],
					}));
				} catch (error) {
					console.log(error);
				}
			})();
		} else if (pathname === "/trainings/user") {
			(async () => {
				try {
					await deleteApproved({ type: "training" }).unwrap();

					setApproved((prev) => ({
						...prev,
						trainingApprove: [],
						trainingDisapprove: [],
						trainingDelete: [],
						trainingBought: [],
					}));
				} catch (error) {
					console.log(error);
				}
			})();
		}
	}, [deleteApproved, pathname]);

	useEffect(() => {
		if (senderId && notifications?.length > 0) {
			setNotifications((prev) =>
				prev.filter(({ sender: { _id } }) => _id !== senderId),
			);
			disaptch(addSenderId(null));
		}
	}, [disaptch, notifications?.length, senderId]);

	useEffect(() => {
		if (notifications) {
			disaptch(setNotificationsRedux(notifications));
		}
	}, [disaptch, notifications]);

	useEffect(() => {
		if (socketRedux && user?.id) {
			socketRedux.on("getNotification", ({ type, sender, ref }) => {
				//console.log(socketRedux);
				setNotifications((prev) => [
					...prev,
					{
						receiver: user?.id,
						sender,
						type,
						ref,
						createdAt: new Date().getTime(),
					},
				]);
				//dispatch(addMessage({ value: 1 }));
			});
		}
	}, [socketRedux, user?.id]);

	useEffect(() => {
		if (socketRedux && user?.id) {
			socketRedux.on("getNotifApproved", ({ type, sender, ref }) => {
				const key = type
					.split("/")
					.reduce(
						(acc, cur, i) =>
							i % 2 ? (acc += cur.charAt(0).toUpperCase() + cur.slice(1)) : cur,
						"",
					);
				if (key.includes("post") && pathname === "/posts/user") {
					(async () => {
						try {
							await deleteApproved({ type: "post" }).unwrap();

							setApproved((prev) => ({
								...prev,
								postApprove: [],
								postDisapprove: [],
								postDelete: [],
							}));
						} catch (error) {
							console.log(error);
						}
					})();
				} else if (key.includes("training") && pathname === "/trainings/user") {
					(async () => {
						try {
							await deleteApproved({ type: "training" }).unwrap();

							setApproved((prev) => ({
								...prev,
								trainingApprove: [],
								trainingDisapprove: [],
								trainingDelete: [],
								trainingBought: [],
							}));
						} catch (error) {
							console.log(error);
						}
					})();
				} else {
					setApproved((prev) => ({
						...prev,
						[key]: [
							...prev[key],
							{
								receiver: user?.id,
								sender,
								type,
								ref,
								createdAt: new Date().getTime(),
							},
						],
					}));
				}
			});
		}
	}, [deleteApproved, pathname, socketRedux, user?.id]);

	useEffect(() => {
		if (socketRedux && notifications?.length > 0) {
			socketRedux.on("getDeleteNotif", ({ convId }) => {
				console.log({
					convId,
					notifications,
					map: notifications.filter(({ ref }) => ref !== convId),
				});
				setNotifications((prev) => prev.filter(({ ref }) => ref !== convId));
			});
		}
	}, [notifications, socketRedux]);

	if ([!socketRedux, isLoading, notifications, user?.id].every(Boolean))
		return <></>;

	return (
		<PopUp
			notifications={notifications}
			userId={user?.id}
			setNotifications={setNotifications}
			approved={approved}
			setApproved={setApproved}
			portal={portal}
			left={left}
		/>
	);
};

export default PopupWrapper;
