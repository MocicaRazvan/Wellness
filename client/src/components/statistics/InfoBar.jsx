import React, { useEffect, useMemo, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import {
	Box,
	CircularProgress,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import months from "../../utils/consts/months";
import noData from "../../utils/lottie/noData.json";
import Lottie from "react-lottie-player";
import { useGetTotalUserMonthQuery } from "../../redux/orders/orderApi";
import Header from "../reusable/Header";
const InfoBar = ({
	userId,
	maxYear = new Date().getFullYear() - 9,
	title = "Spendings by month",
	subtitle = "Bar of monthly Spendings and Units",
	small = "false",
}) => {
	const theme = useTheme();
	const isNonMobile = useMediaQuery("(min-width:1000px)");
	const [layout, setLayout] = useState("horizontal");
	const [year, setYear] = useState(new Date().getFullYear());
	const years = useMemo(() => {
		const items = [];
		for (let i = new Date().getFullYear(); i >= maxYear; i--) {
			items.push(<MenuItem value={i}>{i}</MenuItem>);
		}
		return items;
	}, [maxYear]);
	const { data, isLoading } = useGetTotalUserMonthQuery(
		{ year, userId },
		{ refetchOnReconnect: true },
	);

	const formatedData = useMemo(
		() =>
			data?.map(({ _id, total: t, units }) => ({
				month: months[_id - 1],
				total: t / 100,
				"units*10": units * 10,
			})),
		[data],
	);
	if (isLoading || !data)
		return (
			<CircularProgress
				sx={{ position: "absolute", top: "50%", left: "50%" }}
				size="3rem"
				thickness={7}
			/>
		);

	return (
		<Box width="100%" height="75vh" m="1.5rem 2.5rem">
			<Header title={title} subtitle={subtitle} small={small} />
			<FormControl sx={{ mt: "1rem", ml: 2 }}>
				<InputLabel>Year</InputLabel>
				<Select
					value={year}
					label="Year"
					inputProps={{
						MenuProps: {
							MenuListProps: {
								sx: {
									maxHeight: 220,
								},
							},
						},
					}}
					onChange={(e) => setYear(e.target.value)}>
					{years}
				</Select>
			</FormControl>
			{!data || data?.length === 0 ? (
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
			) : (
				<Box width="100%" height="100%">
					<ResponsiveBar
						data={formatedData || []}
						keys={["total", "units*10"]}
						indexBy="month"
						margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
						padding={0.25}
						groupMode="grouped"
						valueScale={{ type: "linear" }}
						indexScale={{ type: "band", round: true }}
						// layout={isNonMobile ? "vertical" : "horizontal"}
						layout={layout}
						colors={{ scheme: "dark2" }}
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
			)}
		</Box>
	);
};

export default InfoBar;
