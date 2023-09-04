const { S3Client, PutObjectCommand, ListObjectsCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

require('dotenv').config();
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION;
const AWS_PUBLIC_KEY = process.env.AWS_PUBLIC_KEY;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;

const fs = require('fs');

const client = new S3Client({
    region: AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: AWS_PUBLIC_KEY,
        secretAccessKey: AWS_SECRET_KEY
    }
});

const uploadFile = async (file) => {
    const stream = fs.createReadStream(file.path);

    const command = new PutObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: file.originalname,
        Body: stream
    });

    return await client.send(command);
}

const getFiles = async () => {
    const command = new ListObjectsCommand({
        Bucket: AWS_BUCKET_NAME
    });

    return await client.send(command);
}

const getFile = async (filename) => {
    const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: filename
    });

    return await client.send(command);
}

const downloadFile = async (filename) => {
    const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: filename
    });

    const result = await client.send(command);

    result.Body.pipe(fs.createWriteStream(`./images/${filename}`));
}

const getFileURL = async (filename) => {
    const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: filename
    });
    return await getSignedUrl(client, command, { expiresIn: 604800 });
}

module.exports = {
    uploadFile,
    getFiles,
    getFile,
    downloadFile,
    getFileURL,
}