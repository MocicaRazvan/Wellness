import LootieCustom from "../../components/reusable/LootieCustom";
import PageNotFound from "../../utils/lottie/PageNotFound.json";
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
