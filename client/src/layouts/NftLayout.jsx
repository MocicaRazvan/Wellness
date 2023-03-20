import React from "react";
import { Outlet } from "react-router-dom";
import Loading from "../components/reusable/Loading";
import { NftProvider } from "../context/NftContext";
import { store } from "../redux/store";

const NftLayout = () => {
	// return store?.getState()?.contracts && store.dispatch ? (
	// 	<Outlet context={[store?.getState().contracts, store.dispatch]} />
	// ) : (
	// 	""
	// );
	return (
		<NftProvider>
			<Outlet />
		</NftProvider>
	);
};

export default NftLayout;
