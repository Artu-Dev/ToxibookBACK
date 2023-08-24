import fs from "fs"
import aws from "aws-sdk";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const s3 = new aws.S3();


export default async function deleteImage(oldImgKey) {
	if (process.env.STORAGE_TYPE === "s3") {
		await s3.deleteObject({
			Bucket: process.env.AWS_BUCKET_NAME,
			Key: oldImgKey,
		}).promise();
	} else {
		const pathToImg = path.resolve(__dirname, "..", "..", "tmp", "uploads", oldImgKey);
		
		fs.unlink(pathToImg, (err) => {
			console.log(err);
		});
	}
}