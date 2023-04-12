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
} from "@mui/material";
import { Box } from "@mui/system";
import blankImage from "../../images/profile/blank-profile-picture-g212f720fb_640.png";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useDeletePostMutation } from "../../redux/posts/postsApiSlice";
import { useState } from "react";
import UserAgreement from "../../components/reusable/UserAgreement";

const PostCard = ({ item, user }) => {
	const navigate = useNavigate();
	const theme = useTheme();
	const [deletePost] = useDeletePostMutation();
	const [open, setOpen] = useState(false);
	const handleDelete = async () => {
		try {
			await deletePost({ id: item.id }).unwrap();
		} catch (error) {
			console.log(error);
		}
	};

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
					onClick={() => void navigate(`/posts/find/${item.id}`)}>
					<Box position="relative">
						<CardMedia sx={{ height: 240 }} image={item.images[0].url} />
						{!item?.approved && (
							<Typography
								color="error"
								sx={{
									position: "absolute",
									top: "50%",
									left: "50%",
									transform: "translate(-50%, -50%)",
									zIndex: 100,
									fontWeight: 900,
									fontSize: 25,
									textAlign: "center",
								}}>
								NOT APPROVED
							</Typography>
						)}
					</Box>
					<CardContent>
						<Typography
							gutterBottom
							variant="h5"
							component="h2"
							color={theme.palette.secondary[200]}
							fontWeight="600">
							{item?.title}
						</Typography>
						<Typography
							variant="body2"
							color={theme.palette.secondary[200]}
							component="p">
							{item.body.replace(/<\/?[^>]+>/gi, " ").slice(0, 100) + "..."}
						</Typography>
					</CardContent>
				</CardActionArea>
				<CardActions
					sx={{
						display: "flex",
						margin: "0 10px",
						justifyContent: "space-between",
						p: 1,
					}}>
					<Box sx={{ display: "flex" }}>
						<Avatar src={item?.user?.image?.url || blankImage} />
						<Box ml={2}>
							<Typography variant="subtitle2" component="p">
								{item?.user?.username}
							</Typography>
							<Typography
								variant="subtitle2"
								color="textSecondary"
								component="p">
								{moment(item.createdAt).format("YYYY-MM-DD")}
							</Typography>
						</Box>
					</Box>{" "}
					{user === "true" && (
						<>
							<Button
								size="medium"
								sx={{ color: theme.palette.secondary[300] }}
								focusRipple={true}
								onClick={() => void navigate(`/posts/user/edit/${item.id}`)}>
								Update
							</Button>
							<Button
								size="medium"
								// sx={{ color: theme.palette.secondary[300] }}
								color="error"
								focusRipple={true}
								onClick={() => void setOpen((prev) => !prev)}>
								Delete
							</Button>
						</>
					)}
					{user !== "true" && (
						<Button
							size="medium"
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
