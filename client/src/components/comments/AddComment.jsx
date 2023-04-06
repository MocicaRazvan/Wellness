import {
	Avatar,
	Button,
	Card,
	Stack,
	TextField,
	ThemeProvider,
	Box,
	useTheme,
} from "@mui/material";
import { useState } from "react";
import { useCreateCommentMutation } from "../../redux/comments/commentsApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import blankUser from "../../images/profile/blank-profile-picture-g212f720fb_640.png";
import Perspective from "perspective-api-client";
import Loading from "../reusable/Loading";

const perspective = new Perspective({
	apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
});

const AddComment = ({ type, id }) => {
	const [createComment] = useCreateCommentMutation();
	const [body, setBody] = useState("");
	const [loading, setLoading] = useState({
		show: false,
		msg: "Calm down!",
		color: "red",
	});
	const user = useSelector(selectCurrentUser);
	const { palette } = useTheme();

	const handleAddComment = async () => {
		try {
			const result = await perspective.analyze({
				comment: { text: body },
				requestedAttributes: { TOXICITY: { scoreThreshold: 0.6 } },
			});
			if (result?.attributeScores?.TOXICITY) {
				setLoading((prev) => ({ ...prev, show: true }));
				setBody("");
				setTimeout(() => {
					setLoading((prev) => ({ ...prev, show: false }));
				}, 2500);
				return;
			}
			await createComment({ body, [type]: id }).unwrap();
			setBody("");
		} catch (error) {
			console.log(error);
			setLoading((prev) => ({
				...prev,
				show: true,
				msg: "please write in english",
			}));
			setBody("");
			setTimeout(() => {
				setLoading((prev) => ({ ...prev, show: false, msg: "Calm down!" }));
			}, 2500);
			return;
		}
	};

	return (
		<Card sx={{ bgcolor: palette.primary.main }}>
			<Loading loading={loading} type="alert" />
			<Box sx={{ p: "15px" }}>
				<Stack direction="row" spacing={2} alignItems="flex-start">
					<Avatar src={user?.image?.url || blankUser} variant="rounded" />
					<TextField
						multiline
						fullWidth
						minRows={4}
						placeholder="Add a comment"
						inputProps={{
							style: { color: palette.secondary[400] },
						}}
						sx={{
							"& label.Mui-focused": {
								color: palette.secondary[400],
							},
							" & .MuiOutlinedInput-root": {
								"&.Mui-focused fieldset": {
									borderColor: palette.background.default,
								},
							},
						}}
						value={body}
						onChange={(e) => {
							setBody(e.target.value);
						}}
					/>
					{body && (
						<Button
							size="large"
							sx={{
								bgcolor: "secondary.main",
								color: "primary.main",
								p: "8px 25px",
							}}
							onClick={(e) => {
								handleAddComment();
							}}>
							Send
						</Button>
					)}
				</Stack>
			</Box>
		</Card>
	);
};

export default AddComment;
