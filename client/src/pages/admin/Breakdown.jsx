import { Box } from "@mui/system";
import React from "react";
import BreakdownChart from "../../components/admin/BreakdownChart";
import OrdersTagRadarChart from "../../components/admin/OrdersTagRadarChart";
import Header from "../../components/reusable/Header";

const Breakdown = () => {
	return (
		<Box m="1.5rem 2.5rem" display="column" overflow="hidden">
			<Box flex={1} overflow="hidden">
				<Header title="Breakdown" subtitle="Breakdown of month by category" />
				<Box mt="40px" height="75vh">
					<BreakdownChart />
				</Box>
			</Box>
			<Box flex={1} overflow="hidden">
				<OrdersTagRadarChart />
			</Box>
		</Box>
	);
};

export default Breakdown;
