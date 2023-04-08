import { useTrail, a } from "@react-spring/web";
import React from "react";

const Trail = ({ open, children, h = "80px" }) => {
	const items = React.Children.toArray(children);
	const trail = useTrail(items.length, {
		config: { mass: 7, tension: 3000, friction: 500 },
		opacity: open ? 1 : 0,
		x: open ? 0 : 20,
		height: open ? 110 : 0,
		from: { opacity: 0, x: 20, height: 0 },
	});
	const trails = {
		position: "relative",
		willChange: "transform, opacity",
	};

	return (
		<div>
			{trail.map(({ height, ...style }, index) => (
				<a.div key={index} style={{ ...style, ...trails, height: h }}>
					<a.div style={{ height }}>{items[index]}</a.div>
				</a.div>
			))}
		</div>
	);
};

export default Trail;
