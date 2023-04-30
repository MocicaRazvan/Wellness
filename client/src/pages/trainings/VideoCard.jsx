import { Box, Card, CardContent, Chip, Typography } from "@mui/material";
import React from "react";
import ReactPlayer from "react-player";

const VideoCard = ({ exercise }) => {
	console.log(exercise);
	return (
		<Card
			sx={{
				width: { xs: "100%", sm: "358px", md: "320px" },
				boxShadow: "none",
				borderRadius: 0,
				position: "relative",
				backgroundColor: "primary.main",
			}}>
			<Box
				sx={{ width: { xs: "100%", sm: "358px", md: "320px" }, height: 180 }}>
				<ReactPlayer
					url={exercise?.videos[0].url}
					//controls
					width={"100%"}
					height={"100%"}
					style={{ margin: "0 !important" }}
				/>
			</Box>
			<CardContent>
				<Box>
					<Typography
						variant="subtitle1"
						fontWeight="bold"
						color="#FFF"
						textAlign="center">
						{exercise?.title.slice(0, 60)}
					</Typography>
					<Box sx={{ mt: 1 }}>
						<Typography sx={{ display: "inline", color: "lightgray" }}>
							Targets:
						</Typography>
						{exercise?.muscleGroups?.map((mg) => (
							<Chip key={mg} label={mg} sx={{ color: "lightgray" }} />
						))}
					</Box>
				</Box>
				<Box></Box>
			</CardContent>
		</Card>
	);
};

export default VideoCard;
