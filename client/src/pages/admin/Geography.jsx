import { Box, CircularProgress, useMediaQuery, useTheme } from "@mui/material";
import { ResponsiveChoropleth } from "@nivo/geo";
import React from "react";
import { useOutletContext } from "react-router-dom";
import Header from "../../components/reusable/Header";
import { useGetOrdersLocationQuery } from "../../redux/orders/orderApi";
import { geoData } from "../../utils/geoData/geoData";

const Geography = () => {
	const { data, isLoading } = useGetOrdersLocationQuery();
	const theme = useTheme();
	const isNonSmallScreens = useMediaQuery("(min-width: 620px)");
	const isSideBarOpen = useOutletContext();

	if (isLoading || !data)
		return (
			<CircularProgress
				sx={{ position: "absolute", top: "50%", left: "50%" }}
				size="3rem"
				thickness={7}
			/>
		);

	return (
		<Box m="1.5rem 2.5rem" pb={2} sx={{ overflowX: "hidden" }}>
			<Header
				small={!isNonSmallScreens && isSideBarOpen ? "true" : "false"}
				title="GEOGRAPHY"
				subtitle="Find where orders shipping addresses are"
			/>
			<Box
				sx={{ overflowY: "hidden" }}
				flex={1}
				mt="40px"
				height="75vh"
				bgcolor={
					theme.palette.mode === "dark"
						? theme.palette.background.alt
						: theme.palette.secondary[800]
				}
				border={`1px solid ${theme.palette.secondary[200]}`}
				borderRadius="4px">
				<ResponsiveChoropleth
					data={data}
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
								backgroundColor: theme.palette.background.alt,
							},
						},
					}}
					features={geoData.features}
					margin={{ top: 0, right: 0, bottom: 0, left: -50 }}
					domain={[0, 60]} // min adn the max values of people/country
					unknownColor="#666666"
					label="properties.name"
					valueFormat=".2s"
					projectionScale={150}
					projectionTranslation={[0.45, 0.6]}
					projectionRotation={[0, 0, 0]}
					borderWidth={1.3}
					borderColor={theme.palette.secondary[200]}
					legends={[
						{
							anchor: "bottom-right",
							direction: "column",
							justify: true,
							translateX: 0,
							translateY: -125,
							itemsSpacing: 0,
							itemWidth: 94,
							itemHeight: 18,
							itemDirection: "left-to-right",
							itemTextColor: theme.palette.secondary[200],
							itemOpacity: 0.85,
							symbolSize: 18,
							effects: [
								{
									on: "hover",
									style: {
										itemTextColor: theme.palette.background.alt,
										itemOpacity: 1,
									},
								},
							],
						},
					]}
				/>
			</Box>
		</Box>
	);
};

export default Geography;
