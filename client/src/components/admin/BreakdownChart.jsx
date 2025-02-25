import { Box, CircularProgress, useTheme } from "@mui/material";
import { ResponsivePie } from "@nivo/pie";
import React from "react";
import Lottie from "react-lottie-player";
import { useGetAllMonthlyStatsQuery } from "../../redux/user/userApi";
import noData from "../../utils/lottie/noData.json";

const BreakdownChart = ({
	isDashboard = false,
	year = new Date().getFullYear(),
	month = new Date().getMonth() + 1,
}) => {
	const { data, isLoading } = useGetAllMonthlyStatsQuery(
		{ year, month },
		{
			refetchOnFocus: true,
		},
	);
	const theme = useTheme();
	if (isLoading || !data)
		return (
			<CircularProgress
				sx={{ position: "absolute", top: "50%", left: "50%" }}
				size="3rem"
				thickness={7}
			/>
		);

	const colors = [
		theme.palette.secondary[200],
		theme.palette.secondary[400],
		theme.palette.secondary[300],
		theme.palette.secondary[500],
	];

	console.log({ data });
	if (Object.values(data).reduce((acc, cur) => (acc += cur), 0) === 0) {
		return (
			<Box
				width="100%"
				height="100%"
				display="flex"
				justifyContent="center"
				alignItems="center">
				<Lottie
					loop
					animationData={noData}
					play
					style={{ width: "65%", height: "65%", margin: 0, padding: 0 }}
				/>
			</Box>
		);
	}

	const formattedData = Object.entries(data)
		.map(([type, nr], i) => ({
			id: type,
			label: type,
			value: nr,
		}))
		.sort((a, b) => a.value - b.value)
		.map((e, i) => ({ ...e, color: colors[i] }));

	return (
		<Box
			height={isDashboard ? "400px" : "90%"}
			width={undefined}
			minHeight={isDashboard ? "325px" : undefined}
			minWidth={isDashboard ? "325px" : undefined}
			position="relative">
			<ResponsivePie
				data={formattedData}
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
							backgroundColor: theme.palette.background.default,
							color: theme.palette.secondary[300],
						},
					},
				}}
				colors={{ datum: "data.color" }}
				margin={
					isDashboard
						? { top: 40, right: 80, bottom: 100, left: 50 }
						: { top: 40, right: 80, bottom: 80, left: 80 }
				}
				sortByValue={true}
				innerRadius={0.45}
				activeOuterRadiusOffset={8}
				borderWidth={1}
				borderColor={{
					from: "color",
					modifiers: [["darker", 0.2]],
				}}
				enableArcLinkLabels={!isDashboard}
				arcLinkLabelsTextColor={theme.palette.secondary[200]}
				arcLinkLabelsThickness={2}
				arcLinkLabelsColor={{ from: "color" }}
				arcLabelsSkipAngle={10}
				arcLabelsTextColor={{
					from: "color",
					modifiers: [["darker", 2]],
				}}
				legends={[
					{
						anchor: "bottom",
						direction: "row",
						justify: false,
						translateX: isDashboard ? 20 : 0,
						translateY: isDashboard ? 50 : 56,
						itemsSpacing: 0,
						itemWidth: 85,
						itemHeight: 18,
						itemTextColor: "#999",
						itemDirection: "left-to-right",
						itemOpacity: 1,
						symbolSize: 18,
						symbolShape: "circle",
						effects: [
							{
								on: "hover",
								style: {
									itemTextColor: theme.palette.primary[500],
								},
							},
						],
					},
				]}
			/>
		</Box>
	);
};

export default BreakdownChart;
