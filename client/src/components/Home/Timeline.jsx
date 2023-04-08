import { Box, Typography, useTheme } from "@mui/material";
import {
	VerticalTimeline,
	VerticalTimelineElement,
} from "react-vertical-timeline-component";

const Timeline = ({ items }) => {
	const { palette } = useTheme();
	return (
		<VerticalTimeline lineColor={palette.secondary[300]}>
			{items.map(({ date, title, text, icon }) => (
				<VerticalTimelineElement
					className="vertical-timeline-element--work"
					contentStyle={{
						backgroundColor: palette.primary.main,
						boxShadow: `0 3px 0 ${palette.secondary[300]}`,
					}}
					contentArrowStyle={{
						borderRight: `7px solid ${palette.secondary[300]}`,
					}}
					date={
						<Typography
							align="center"
							variant="h2"
							textAlign="start"
							fontWeight={700}
							sx={{
								fontSize: 45,
								color: `${
									palette.mode === "dark"
										? palette.secondary[200]
										: palette.secondary[500]
								}!important`,
							}}>
							{date}
						</Typography>
					}
					iconStyle={{ background: palette.secondary[500], boxShadow: "none" }}
					icon={icon}>
					<Typography
						align="center"
						variant="h2"
						textAlign="center"
						fontWeight={900}
						sx={{
							fontSize: 45,
							color: `${palette.secondary[400]}!important`,
							mb: 2,
						}}>
						{title}
					</Typography>
					<Box display="flex" alignItems="center" justifyContent="center">
						<Typography
							align="center"
							variant="h2"
							textAlign="center"
							fontWeight={500}
							sx={{
								fontSize: { xs: 24, sm: 33, md: 45 },
								color: `${palette.secondary[200]}!important`,
							}}>
							{text}
						</Typography>
					</Box>
				</VerticalTimelineElement>
			))}
		</VerticalTimeline>
	);
};

export default Timeline;
