export const truncate = (text, startChars, endChars, maxLength) => {
	if (text.length > maxLength) {
		let start = text.substring(0, startChars);
		let end = text.substring(text.length - endChars, text.length);
		while (start.length + end.length < maxLength) {
			start = start + ".";
		}
		return start + end;
	}
	return text;
};
