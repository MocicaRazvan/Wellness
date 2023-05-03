import {
	CircularProgress,
	TextField,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useGetdDailyEarningsQuery } from "../../redux/orders/orderApi";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import { Box } from "@mui/system";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ResponsiveLine } from "@nivo/line";
import Lottie from "react-lottie-player";
import { useOutletContext } from "react-router-dom";
import Header from "../../components/reusable/Header";
import noData from "../../utils/lottie/noData.json";

const Daily = ({
	admin = true,
	title = "DAILY SALES",
	subtitle = "Chart of daily sales",
	isProfile = false,
	curve = "catmullRom",
	small = "false",
}) => {
	const { data, isLoading } = useGetdDailyEarningsQuery({ admin });
	const theme = useTheme();

	const [startDate, setStartDate] = useState(new Date("2020-01-01"));
	const [endDate, setEndDate] = useState(new Date("2030-01-01"));
	const [firstStartDate, setFirstStartDate] = useState(null);
	const [firstEndDate, setFirstEndDate] = useState(null);
	const dateRef = useRef({ start: null, end: null });
	const isSideBarOpen = useOutletContext();
	const isNonSmallScreens = useMediaQuery("(min-width: 620px)");
	const isClose = !isNonSmallScreens && isSideBarOpen;
	useEffect(() => {
		const sortedDates = data
			?.map(({ date }) => date)
			?.sort((a, b) => (moment(a) > moment(b) ? 1 : -1));
		if (sortedDates) {
			if (dateRef.current.start === null) {
				dateRef.current.start = true;
				setFirstStartDate(new Date(sortedDates[0]));
			}

			if (dateRef.current.end === null) {
				dateRef.current.end = true;
				setFirstEndDate(new Date(sortedDates.at(-1)));
			}
			setStartDate(new Date(sortedDates[0]));
			setEndDate(new Date(sortedDates.at(-1)));
		}
	}, [data]);

	console.log({ data });

	const [formattedData] = useMemo(() => {
		if (!data) return [];

		const totalSalesLine = {
			id: !isProfile ? "totalSales" : "totlatSpendings",
			color: theme.palette.secondary.main,
			data: [],
		};
		const totalUnitsLine = {
			id: "10*totalUnits",
			color: theme.palette.secondary[600],
			data: [],
		};

		Object.values(data).forEach(({ date, totalSales, totalUnits }) => {
			const dateFormatted = new Date(date);
			if (dateFormatted >= startDate && dateFormatted <= endDate) {
				const splitDate = date.substring(date.indexOf("-") + 1);

				totalSalesLine.data = [
					...totalSalesLine.data,
					{ x: splitDate, y: totalSales / 100 },
				];
				totalUnitsLine.data = [
					...totalUnitsLine.data,
					{ x: splitDate, y: totalUnits * 10 },
				];
			}
		});

		const formattedData = [totalSalesLine, totalUnitsLine];
		return [formattedData];
	}, [data, isProfile, theme.palette.secondary, startDate, endDate]);

	if (isLoading || !data)
		return (
			<CircularProgress
				sx={{ position: "absolute", top: "50%", left: "50%" }}
				size="3rem"
				thickness={7}
			/>
		);

	return (
		<Box m="1.5rem 2.5rem" overflow="hidden">
			<Header title={title} subtitle={subtitle} small={small} />
			<Box height="75vh" mt={1} display={isClose ? "none" : "block"}>
				<Box display="flex" justifyContent="flex-end">
					<LocalizationProvider children dateAdapter={AdapterDateFns}>
						<DesktopDatePicker
							maxDate={endDate}
							minDate={
								dateRef.current.start !== null ? firstStartDate : startDate
							}
							value={startDate}
							onChange={(date) => setStartDate(date)}
							renderInput={(params) => <TextField {...params} />}
						/>
						<DesktopDatePicker
							maxDate={dateRef.current.end !== null ? firstEndDate : endDate}
							minDate={startDate}
							value={endDate}
							onChange={(date) => setEndDate(date)}
							renderInput={(params) => <TextField {...params} />}
						/>
					</LocalizationProvider>
				</Box>
				{data?.length === 0 ? (
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
					<Box width="100%" height="100%" px={{ xs: 2, md: 4 }}>
						<ResponsiveLine
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
										color: theme.palette.secondary[300],
										backgroundColor: theme.palette.primary.main,
									},
								},
							}}
							colors={{ datum: "color" }}
							margin={{ top: 50, right: 50, bottom: 70, left: 60 }}
							xScale={{ type: "point" }}
							yScale={{
								type: "linear",
								min: "auto",
								max: "auto",
								stacked: false,
								reverse: false,
							}}
							yFormat=" >-.2f"
							curve={curve}
							axisTop={null}
							axisRight={null}
							axisBottom={{
								orient: "bottom",
								tickSize: 5,
								tickPadding: 0,
								tickRotation: 0,
								legend: "Month",
								legendOffset: -10,
								legendPosition: "middle",
							}}
							axisLeft={{
								orient: "left",
								tickSize: 5,
								tickPadding: 5,
								tickRotation: 0,
								legend: "Total",
								legendOffset: 10,
								legendPosition: "middle",
							}}
							enableGridX={false}
							enableGridY={false}
							pointSize={10}
							pointColor={{ theme: `background` }}
							pointBorderWidth={2}
							pointBorderColor={{ from: "serieColor" }}
							pointLabelYOffset={-12}
							useMesh={true}
							legends={[
								{
									anchor: "top-right",
									direction: "column",
									justify: false,
									translateX: 50,
									translateY: 0,
									itemsSpacing: 0,
									itemDirection: "left-to-right",
									itemWidth: 90,
									itemHeight: 20,
									itemOpacity: 0.75,
									symbolSize: 12,
									symbolShape: "circle",
									symbolBorderColor: "rgba(24, 24, 24, 0.5)",
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
							]}
						/>
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default Daily;
