import InfoIcon from "@mui/icons-material/Info";
import { IconButton } from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/system";
const CustomWidthTooltip = styled(({ className, ...props }) => (
	<Tooltip {...props} classes={{ popper: className }} />
))({
	[`& .${tooltipClasses.tooltip}`]: {
		maxWidth: 200,
	},
});

const CustomTooltip = ({ text }) => {
	return (
		<CustomWidthTooltip title={text}>
			<IconButton>
				<InfoIcon color="primary" />
			</IconButton>
		</CustomWidthTooltip>
	);
};

export default CustomTooltip;
