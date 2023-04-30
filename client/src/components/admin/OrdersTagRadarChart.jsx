import { Box, CircularProgress, useTheme } from "@mui/material";
import { useMemo } from "react";
import {
	PolarAngleAxis,
	PolarGrid,
	PolarRadiusAxis,
	Radar,
	RadarChart,
	ResponsiveContainer,
} from "recharts";
import { useGetTagStatsQuery } from "../../redux/orders/orderApi";
import Header from "../reusable/Header";

const OrdersTagRadarChart = () => {
	const { data, isLoading } = useGetTagStatsQuery(null, {
		refetchOnMountOrArgChange: true,
		refetchOnReconnect: true,
	});
	const theme = useTheme();
	// const max = useMemo(
	// 	() =>
	// 		data?.reduce((acc, { total }) => (total > acc ? (acc = total) : acc), 0),

	// 	[data],
	// );
	const formatedData = useMemo(() => {
		if (data) {
			const c = [...data];
			c?.sort((a, b) => a.total - b.total);
			return c;
		}
		return [];
	}, [data]);
	if (isLoading || !data)
		return (
			<CircularProgress
				sx={{ position: "absolute", top: "50%", left: "50%" }}
				size="3rem"
				thickness={7}
			/>
		);

	return (
		<Box>
			<Header
				title="Orders by tag"
				subtitle="Brakedown of orders by the trainings tags in them"
			/>
			<ResponsiveContainer width="100%" aspect={2}>
				<RadarChart cx="50%" cy="50%" outerRadius="80%" data={formatedData}>
					<PolarGrid />
					<PolarAngleAxis dataKey="tag" />
					<PolarRadiusAxis domain={[0, formatedData.at(-1)?.total]} angle={0} />
					<Radar
						dataKey="total"
						stroke={theme.palette.secondary.main}
						fill={theme.palette.secondary.main}
						fillOpacity={0.5}
					/>
				</RadarChart>
			</ResponsiveContainer>
		</Box>
	);
};

export default OrdersTagRadarChart;
