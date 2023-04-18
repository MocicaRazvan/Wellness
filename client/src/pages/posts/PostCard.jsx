import {
	Avatar,
	Button,
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	CardMedia,
	Typography,
	useTheme,
	alpha,
} from "@mui/material";
import { Box } from "@mui/system";
import blankImage from "../../images/profile/blank-profile-picture-g212f720fb_640.png";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import {
	useDeletePostMutation,
	useDisplayPostMutation,
} from "../../redux/posts/postsApiSlice";
import { useState } from "react";
import UserAgreement from "../../components/reusable/UserAgreement";

const PostCard = ({ item, user }) => {
	const navigate = useNavigate();
	const theme = useTheme();
	const [deletePost] = useDeletePostMutation();
	const [displayPost] = useDisplayPostMutation();
	const [openDisplay, setOpenDisplay] = useState(null);
	const [open, setOpen] = useState(false);
	const handleDelete = async () => {
		try {
			await deletePost({ id: item.id }).unwrap();
		} catch (error) {
			console.log(error);
		}
	};
	const handleDisplay = async () => {
		try {
			await displayPost({ id: item.id }).unwrap();
		} catch (error) {
			console.log(error);
		}
	};
	if (!item) return;

	return (
		<>
			<UserAgreement
				open={open}
				setOpen={setOpen}
				title={"Confirm delete"}
				text={
					"Are you sure you want to delete this post? You can't undo after you press Agree, be careful what you want."
				}
				handleAgree={async () => await handleDelete()}
			/>
			<UserAgreement
				open={openDisplay}
				setOpen={setOpenDisplay}
				title={`Confirm ${!item.display ? "Show" : "Hide"}`}
				text={`Are you sure you want to ${
					!item.display ? "show" : "hide"
				} this post? You can't undo after you press Agree, be careful what you want.`}
				handleAgree={async () => await handleDisplay()}
			/>
			<Card
				sx={{
					maxWidth: "100%",
					height: { xs: 420 },
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					boxShadow: `2px 2px 20px 2px ${theme.palette.background.alt}`,
					borderRadius: 3,
				}}>
				<CardActionArea
					disableRipple
					onClick={() => void navigate(`/posts/find/${item.id}`)}
					sx={{
						bgcolor: !item?.approved
							? theme.palette.error[theme.palette.mode]
							: !item?.display
							? alpha(theme.palette.warning.dark, 1)
							: "initial",
					}}>
					<Box position="relative">
						<CardMedia
							sx={{ height: 240 }}
							image={item.images[0].url}
							loading="lazy"
							component="img"
						/>
						{!item?.approved ? (
							<Typography
								color="error"
								sx={{
									position: "absolute",
									top: "50%",
									left: "50%",
									transform: "translate(-50%, -50%)",
									zIndex: 10,
									fontWeight: 900,
									fontSize: 25,
									textAlign: "center",
									p: 1.2,
									borderRadius: 3,
									bgcolor: "rgba(0,0,0,0.66)",
								}}>
								NOT APPROVED
							</Typography>
						) : !item?.display ? (
							<Typography
								sx={{
									color: theme.palette.warning.dark,
									position: "absolute",
									top: "50%",
									left: "50%",
									transform: "translate(-50%, -50%)",
									zIndex: 10,
									fontWeight: 900,
									fontSize: 25,
									textAlign: "center",
									p: 1.2,
									borderRadius: 3,
									bgcolor: "rgba(0,0,0,0.66)",
								}}>
								NOT DISPLAYED
							</Typography>
						) : null}
					</Box>
					<CardContent>
						<Typography
							gutterBottom
							variant="h5"
							component="h2"
							color={theme.palette.secondary[300]}
							fontWeight="600">
							{item?.title}
						</Typography>
						<Typography
							variant="body2"
							color={theme.palette.secondary[300]}
							component="p">
							{item.body.replace(/<\/?[^>]+>/gi, " ").slice(0, 90) + "..."}
						</Typography>
					</CardContent>
				</CardActionArea>
				<CardActions
					sx={{
						display: "flex",
						m: 1,
						justifyContent: "space-between",
						p: 1,
					}}>
					{user !== "true" && (
						<Box sx={{ display: "flex" }}>
							<Avatar src={item?.user?.image?.url || blankImage} />
							<Box ml={2}>
								<Typography
									variant="subtitle2"
									component="p"
									color={theme.palette.secondary[100]}>
									{item?.user?.username}
								</Typography>
								<Typography
									variant="subtitle2"
									color={theme.palette.secondary[100]}
									component="p">
									{moment(item.createdAt).format("YYYY-MM-DD")}
								</Typography>
							</Box>
						</Box>
					)}
					{user === "true" && (
						<Box
							display="flex"
							justifyContent="center"
							alignItems="center"
							flexDirection="column"
							width="100%"
							gap={1}>
							<Box
								width="100%"
								display="flex"
								justifyContent="space-between"
								alignItems="center">
								<Typography
									color={theme.palette.secondary[200]}
									fontWeight={600}>
									Created: {moment(item.createdAt).format("YYYY-MM-DD")}
								</Typography>
								<Typography
									color={theme.palette.secondary[200]}
									fontWeight={600}>
									Updated: {moment(item.updatedAt).format("YYYY-MM-DD")}
								</Typography>
							</Box>
							<Box
								display="flex"
								alignItems="center"
								justifyContent="space-between"
								width="100%"
								pb={2}
								// sx={{
								// 	position: "absolute",
								// 	top: "-50%",
								// 	left: "50%",
								// 	transform: "translate(-50%, -50%)",
								// }}
							>
								<Button
									size="large"
									sx={{ color: theme.palette.secondary[300] }}
									focusRipple={true}
									onClick={() => void navigate(`/posts/user/edit/${item.id}`)}>
									Update
								</Button>
								<Button
									size="large"
									// sx={{ color: theme.palette.secondary[300] }}
									color="error"
									focusRipple={true}
									onClick={() => void setOpen((prev) => !prev)}>
									Delete
								</Button>
								<Button
									size="large"
									// sx={{ color: theme.palette.secondary[300] }}
									color="warning"
									disabled={!item?.approved}
									focusRipple={true}
									onClick={() => void setOpenDisplay((prev) => !prev)}>
									{item?.display ? "hide" : "display"}
								</Button>{" "}
							</Box>
						</Box>
					)}
					{user !== "true" && (
						<Button
							size="medium"
							color="success"
							onClick={() => void navigate(`/posts/find/${item.id}`)}>
							Find More
						</Button>
					)}
				</CardActions>
			</Card>
		</>
	);
};

export default PostCard;
