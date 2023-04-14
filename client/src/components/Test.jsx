import React, { useState } from "react";
import TextEditor from "./reusable/TextEditor";
import { Button } from "@mui/material";

const Test = () => {
	const [body, setBody] = useState("");

	return (
		<div style={{ padding: 50 }}>
			<TextEditor setValue={setBody} />
			<Button
				sx={{ mt: 10 }}
				onClick={() => {
					console.log({ body });
				}}>
				CLIKC
			</Button>
		</div>
	);
};

export default Test;
