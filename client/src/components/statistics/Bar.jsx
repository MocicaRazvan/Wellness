import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import React from "react";

const Bar = ({
	formatedData,
	layout = "horizontal",
	color = "dark2",
	groupMode = "grouped",
}) => {
	const theme = useTheme();
	return (
		<Box width="100%" height="100%">
			<ResponsiveBar
				data={formatedData || []}
				keys={["total", "units*10"]}
				indexBy="month"
				margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
				padding={0.25}
				groupMode={groupMode}
				valueScale={{ type: "linear" }}
				indexScale={{ type: "band", round: true }}
				// layout={isNonMobile ? "vertical" : "horizontal"}
				layout={layout}
				colors={{ scheme: color }}
				borderColor={{
					from: "color",
					modifiers: [["darker", "1.5"]],
				}}
				axisTop={null}
				axisRight={null}
				axisBottom={{
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: layout === "vertical" ? "Months" : "Total",
					legendPosition: "middle",
					legendOffset: 32,
				}}
				axisLeft={{
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: layout === "vertical" ? "Total" : "Months",
					legendPosition: "middle",
					legendOffset: -50,
				}}
				enableGridY={false}
				labelSkipWidth={14}
				labelSkipHeight={12}
				labelTextColor={{
					from: "color",
					modifiers: [["darker", 1.6]],
				}}
				legends={[
					{
						dataFrom: "keys",
						anchor: "bottom-right",
						direction: "column",
						justify: false,
						translateX: 120,
						translateY: 0,
						itemsSpacing: 2,
						itemWidth: 100,
						itemHeight: 20,
						itemDirection: "left-to-right",
						itemOpacity: 0.85,
						symbolSize: 20,
						effects: [
							{
								on: "hover",
								style: {
									itemOpacity: 1,
								},
							},
						],
					},
				]}
				theme={{
					axis: {
						domain: {
							line: {
								stroke: theme.palette.secondary[200],
							},
						},
						legend: {
							text: {
								fill: theme.palette.secondary[200],
							},
						},
						ticks: {
							line: {
								stroke: theme.palette.secondary[200],
								strokeWidth: 1,
							},
							text: {
								fill: theme.palette.secondary[200],
							},
						},
					},
					legends: {
						text: {
							fill: theme.palette.secondary[200],
						},
					},
					tooltip: {
						container: {
							color: theme.palette.secondary[300],
							backgroundColor: theme.palette.primary.main,
						},
					},
				}}
			/>
		</Box>
	);
};

export default Bar;
