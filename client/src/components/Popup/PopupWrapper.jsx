import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLocation, useSearchParams } from "react-router-dom";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import {
	useDeleteApprovedMutation,
	useGetNotificationsByUserQuery,
} from "../../redux/notifications/notificationsApi";
import { setNotificationsRedux } from "../../redux/notifications/notificationsSlice";
import { selectSocket } from "../../redux/socket/socketSlice";
import PopUp from "./Popup";

const PopupWrapper = ({ portal = false, left = false }) => {
	const socketRedux = useSelector(selectSocket, shallowEqual);
	const user = useSelector(selectCurrentUser, shallowEqual);
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
	// const senderId = useSelector(selectSenderNotification, shallowEqual);
	const disaptch = useDispatch();

	const { pathname, state } = useLocation();
	const { data, isLoading } = useGetNotificationsByUserQuery(
		{ receiverId: user?.id },
		{ refetchOnReconnect: true, refetchOnMountOrArgChange: true },
	);
	const [deleteApproved] = useDeleteApprovedMutation();
	const [searchParams] = useSearchParams();

	useEffect(() => {
		if (data?.notifications) setNotifications(data?.notifications);
	}, [data?.notifications]);

	useEffect(() => {
		if (state?.conversationId) {
			setNotifications((prev) =>
				prev.filter(({ ref }) => ref !== state?.conversationId),
			);
		}
	}, [state?.conversationId]);

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

	// useEffect(() => {
	// 	if (senderId && notifications?.length > 0) {
	// 		setNotifications((prev) =>
	// 			prev.filter(({ sender: { _id } }) => _id !== senderId),
	// 		);
	// 		disaptch(addSenderId(null));
	// 	}
	// }, [disaptch, notifications?.length, senderId]);
	useEffect(() => {
		if (searchParams.get("conv")) {
			setNotifications((prev) =>
				prev.filter(({ ref }) => ref !== searchParams.get("conv")),
			);
		}
	}, [searchParams]);

	useEffect(() => {
		if (notifications) {
			disaptch(setNotificationsRedux(notifications));
		}
	}, [disaptch, notifications]);

	useEffect(() => {
		if (socketRedux && user?.id) {
			socketRedux.on("getNotification", ({ type, sender, ref }) => {
				//console.log(socketRedux);
				console.log({ type, sender });
				setNotifications((prev) => [
					...prev,
					{
						receiver: user?.id,
						sender,
						type,
						ref,
						createdAt: new Date().getTime(),
						_id: Math.random() + new Date().getTime(),
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
				// console.log({
				// 	convId,
				// 	notifications,
				// 	map: notifications.filter(({ ref }) => ref !== convId),
				// });
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
