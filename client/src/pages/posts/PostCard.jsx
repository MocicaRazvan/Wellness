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

const PostCard = ({ item }) => {
	const navigate = useNavigate();
	const theme = useTheme();

	return (
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
				<CardMedia sx={{ height: 240 }} image={item.images[0].url} />
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
						<Typography variant="subtitle2" color="textSecondary" component="p">
							{moment(item.createdAt).format("YYYY-MM-DD")}
						</Typography>
					</Box>
				</Box>
				<Button
					size="medium"
					onClick={() => void navigate(`/posts/find/${item.id}`)}>
					Find More
				</Button>
			</CardActions>
		</Card>
	);
};

export default PostCard;
