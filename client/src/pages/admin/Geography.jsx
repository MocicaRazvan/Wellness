import { Box, CircularProgress, useTheme } from "@mui/material";
import React from "react";
import { useGetOrdersLocationQuery } from "../../redux/orders/orderApi";
import { ResponsiveChoropleth } from "@nivo/geo";
import { geoData } from "../../utils/geoData/geoData";
import Header from "../../components/reusable/Header";

const Geography = () => {
	const { data, isLoading } = useGetOrdersLocationQuery();
	const theme = useTheme();

	if (isLoading || !data)
		return (
			<CircularProgress
				sx={{ position: "absolute", top: "50%", left: "50%" }}
				size="3rem"
				thickness={7}
			/>
		);

	return (
		<Box m="1.5rem 2.5rem">
			<Header
				title="GEOGRAPHY"
				subtitle="Find where orders shipping addresses are"
			/>
			<Box
				mt="40px"
				height="75vh"
				bgcolor={theme.palette.background.alt}
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
								color: theme.palette.background.alt,
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
					borderColor="#fff"
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
