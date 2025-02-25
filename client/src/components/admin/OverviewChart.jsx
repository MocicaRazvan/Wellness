import { Box, CircularProgress, useTheme } from "@mui/material";
import { ResponsiveLine } from "@nivo/line";
import { useMemo } from "react";
import Lottie from "react-lottie-player";
import { useGetEarningsQuery } from "../../redux/orders/orderApi";
import noData from "../../utils/lottie/noData.json";

const OverviewChart = ({
	isDashboard = false,
	view,
	year = new Date().getFullYear(),
	admin = true,
	isProfile,
}) => {
	const theme = useTheme();

	const { data, isLoading } = useGetEarningsQuery(
		{ year, admin },
		{ refetchOnReconnect: true },
	);

	const [totalSalesLine, totalUnitsLine] = useMemo(() => {
		if (!data) return [];

		const totalSalesLine = {
			id: "totalSales",
			color: theme.palette.secondary.main,
			data: [],
		};
		const totalUnitsLine = {
			id: "totalUnits",
			color: theme.palette.secondary[600],
			data: [],
		};

		Object.values(data).reduce(
			(acc, { month, totalSales, totalUnits }) => {
				const curSales = acc.sales + totalSales / 100;
				const curUnits = acc.units + totalUnits;

				totalSalesLine.data = [
					...totalSalesLine.data,
					{ x: month, y: curSales },
				];
				totalUnitsLine.data = [
					...totalUnitsLine.data,
					{ x: month, y: curUnits },
				];

				return { sales: curSales, units: curUnits };
			},
			{ sales: 0, units: 0 },
		);

		return [[totalSalesLine], [totalUnitsLine]];
	}, [data, theme.palette.secondary]);
	console.log({ data, totalSalesLine, totalUnitsLine });

	if (isLoading || !data)
		return (
			<CircularProgress
				sx={{ position: "absolute", top: "50%", left: "50%" }}
				size="3rem"
				thickness={7}
			/>
		);

	if (
		totalSalesLine[0].data?.length === 0 &&
		totalUnitsLine[0].data?.length === 0
	) {
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

	return (
		<ResponsiveLine
			data={view === "sales" ? totalSalesLine : totalUnitsLine}
			enableArea={true}
			areaBaselineValue={
				view === "sales"
					? totalSalesLine[0]?.data[0]?.y
					: totalUnitsLine[0]?.data[0]?.y
			}
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
			margin={{ top: 20, right: 50, bottom: 50, left: 70 }}
			xScale={{ type: "point" }}
			yScale={{
				type: "linear",
				min: "auto",
				max: "auto",
				stacked: false,
				reverse: false,
			}}
			yFormat=" >-.2f"
			curve="catmullRom"
			// enableArea={isDashboard}
			axisTop={null}
			axisRight={null}
			axisBottom={{
				format: (v) => {
					if (isDashboard) return v.slice(0, 3);
					return v;
				},
				orient: "bottom",
				tickSize: 5,
				tickPadding: 5,
				tickRotation: 0,
				legend: isDashboard || isProfile ? "" : "Month",
				legendOffset: 36,
				legendPosition: "middle",
			}}
			axisLeft={{
				orient: "left",
				tickValues: 5,
				tickSize: 5,
				tickPadding: 5,
				tickRotation: 0,
				legend:
					isDashboard || isProfile
						? ""
						: `Total ${
								view === "sales"
									? isProfile
										? "Spendings"
										: "Revenue"
									: "Units"
						  } for Year`,
				legendOffset: -60,
				legendPosition: "middle",
			}}
			enableGridX={false}
			enableGridY={false}
			pointSize={10}
			pointColor={{ theme: "background" }}
			pointBorderWidth={2}
			pointBorderColor={{ from: "serieColor" }}
			pointLabelYOffset={-12}
			useMesh={true}
			legends={
				!isDashboard && !isProfile
					? [
							{
								anchor: "bottom-right",
								direction: "column",
								justify: false,
								translateX: 30,
								translateY: -40,
								itemsSpacing: 0,
								itemDirection: "left-to-right",
								itemWidth: 80,
								itemHeight: 20,
								itemOpacity: 0.75,
								symbolSize: 12,
								symbolShape: "circle",
								symbolBorderColor: "rgba(0, 0, 0, .5)",
								effects: [
									{
										on: "hover",
										style: {
											itemBackground: "rgba(0, 0, 0, .03)",
											itemOpacity: 1,
										},
									},
								],
							},
					  ]
					: undefined
			}
		/>
	);
	// return <></>;
};

export default OverviewChart;
