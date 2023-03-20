const cloudinary = require("../utils/cloudinary");

exports.uploadNftImage = async (req, res) => {
	const { image } = req.body;
	if (image) {
		const uplodRes = await cloudinary.uploader.upload(image, {
			upload_preset: "wellnessNft",
		});
		console.log(uplodRes);
		if (uplodRes) {
			return res.status(200).json({
				message: "Image uploaded",
				image: uplodRes,
			});
		}
		return res.status(500).json({ message: "Could not upload image" });
	}
};
