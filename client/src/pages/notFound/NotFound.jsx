import PageNotFound from "../../utils/lottie/PageNotFound.json";
import LootieCustom from "../../components/reusable/LootieCustom";
const NotFound = () => {
	return (
		<LootieCustom
			lootie={PageNotFound}
			link={"/"}
			btnText="Go Home"
			replace={true}
			title="We can't found the page you are looking for :("
		/>
	);
};

export default NotFound;
