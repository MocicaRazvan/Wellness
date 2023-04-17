import { Box, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/admin/Navbar";
import Sidebar from "../components/admin/Sidebar";
import { selectCurrentUser } from "../redux/auth/authSlice";

const AdminLayout = () => {
	const user = useSelector(selectCurrentUser);
	const isNonMobile = useMediaQuery("(min-width:1600px)");
	const [isSideBarOpen, setIsSideBarOpen] = useState(true);
	if (user?.role !== "admin" || !user) {
		return <Navigate to={"/"} replace={true} />;
	}
	return (
		<Box
			display={isNonMobile ? "flex" : "block"}
			width="100%"
			height="100%"
			// overflow="hidden"
		>
			<Sidebar
				user={user || {}}
				isNonMobile={isNonMobile}
				drawerWidth="250px"
				isSideBarOpen={isSideBarOpen}
				setIsSideBarOpen={setIsSideBarOpen}
			/>

			<Box
				flexGrow={1}
				marginLeft={{
					xs: `${250 * Number(isSideBarOpen)}px`,
					xl: 0,
				}}
				width={`calc(100% - ${Number(isSideBarOpen) * 250}px)`}
				overflowX={"hidden"}>
				<Box overflow={"hidden"}>
					<Navbar
						user={user || {}}
						isSideBarOpen={isSideBarOpen}
						setIsSideBarOpen={setIsSideBarOpen}
					/>
				</Box>
				<Box sx={{ transition: "width 1.5s" }}>
					<Outlet context={isSideBarOpen} />
				</Box>
			</Box>
		</Box>
	);
};

export default AdminLayout;
