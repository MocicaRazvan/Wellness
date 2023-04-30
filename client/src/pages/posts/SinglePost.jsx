import { Box, CircularProgress, Stack } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import { useGetPostByIdQuery } from "../../redux/posts/postsApiSlice";

import Core from "../../components/comments/Core";
import SinglePostCard from "./SinglePostCard";

const SinglePost = () => {
	const { postId } = useParams();
	const { data, isLoading } = useGetPostByIdQuery(
		{ id: postId },
		{
			refetchOnMountOrArgChange: true,
			refetchOnReconnect: true,
		},
	);
	if (isLoading)
		return (
			<CircularProgress
				sx={{ position: "absolute", top: "50%", left: "50%" }}
				size="3rem"
				thickness={7}
			/>
		);

	return (
		<Box m="1.5rem 1rem">
			<Stack gap={4}>
				<Box sx={{ display: "grid", placeItems: "center" }} width="100%">
					<SinglePostCard post={data?.post} />
				</Box>
				<Core type="post" id={postId} />
			</Stack>
		</Box>
	);
};

export default SinglePost;
