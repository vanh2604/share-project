import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});
export default async function handler(req, res) {
    const { path } = JSON.parse(req.body)

    if (!path) {
        return res.json({ message: "Image path is required" }, { status: 400 });
    }

    try {
        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: true,
            transformation: [{ width: 1000, height: 752, crop: "scale" }],
        };

        const result = await cloudinary.uploader.upload(path, options);

        return res.json(result, { status: 200 });
    } catch (error) {
        return res.json({ message: "Failed to upload image on Cloudinary" }, { status: 500 });
    }
}