import { Box } from "@mui/system";
import React from "react";
import UsersDataGrid from "../../components/admin/UsersDataGrid";
import Header from "../../components/reusable/Header";
import { useMediaQuery } from "@mui/material";
import { useOutletContext } from "react-router-dom";

const AllUsers = () => {
	const isNonMobileScreens = useMediaQuery("(min-width: 1200px)");
	const isSideBarOpen = useOutletContext();
	const isSmall = isNonMobileScreens && !isSideBarOpen;
	return (
		<Box m="1.5rem 2.5rem" pb={2} sx={{ overflowX: "hidden" }}>
			<Header title="Users" subtitle="Manage the users" />
			<Box display="flex" justifyContent="center" overflow="hidden" m="0 auto">
				<Box flex={isSmall ? 0.85 : 1} maxWidth={1200}>
					<UsersDataGrid />
				</Box>
			</Box>
		</Box>
	);
};

export default AllUsers;
