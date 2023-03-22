import React from "react";
import { useGetPostByIdQuery } from "../../redux/posts/postsApiSlice";
import { useParams } from "react-router-dom";
import { Container } from "@mui/system";
import { CircularProgress, Stack } from "@mui/material";

import Core from "../../components/comments/Core";
import SinglePostCard from "./SinglePostCard";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";

const SinglePost = () => {
	const { postId } = useParams();
	const { data, isLoading } = useGetPostByIdQuery({ id: postId });
	const user = useSelector(selectCurrentUser);

	if (isLoading)
		return (
			<CircularProgress
				sx={{ position: "absolute", top: "50%", left: "50%" }}
				size="3rem"
				thickness={7}
			/>
		);

	return (
		<Container>
			<Stack gap={4}>
				<SinglePostCard post={data?.post} />
				<Core type="post" id={postId} />
			</Stack>
		</Container>
	);
};

export default SinglePost;
