import { Box } from "@mui/system";
import React from "react";
import UsersDataGrid from "../../components/admin/UsersDataGrid";
import Header from "../../components/reusable/Header";

const AllUsers = () => {
	return (
		<Box m="1.5rem 2.5rem">
			<Header title="Trainings" subtitle="Manage users" />
			<UsersDataGrid />
		</Box>
	);
};

export default AllUsers;
