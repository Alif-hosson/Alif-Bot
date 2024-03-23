const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "dl",
    version: "1.0.0",
    permission: 2,
    credits: "Rahad",
    description: "Convert media from a Google Drive link",
    prefix: true, 
    category: "Media", 
    usages: "/Convert [Google Drive link]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs": ""
    }
};

module.exports.run = async function ({ api, event, args }) {
    const url = args[0];

    if (!url || !url.includes('drive.google.com')) {
        return api.sendMessage('Please provide a valid Google Drive link.', event.threadID, event.messageID);
    }
  
    try {
        // Extract the file ID from the Google Drive link
        const fileId = url.match(/\/file\/d\/(.+?)\//)[1];

        // Construct the new download link
        const downloadLink = `https://drive.google.com/uc?export=download&id=${fileId}`;

        const response = await axios.get(downloadLink, { responseType: 'arraybuffer' });

        if (response.status !== 200) {
            return api.sendMessage('Failed to fetch the media from the provided link.', event.threadID, event.messageID);
        }

        // Extract the file extension from the URL
        const extension = path.extname(url);

        // Generate a random filename
        const filename = `converted${extension}`;

        // Write the downloaded data to a file
        fs.writeFileSync(filename, Buffer.from(response.data, 'binary'));

        // Send the file as an attachment
        api.sendMessage(
            {
                body: `Converted media from the provided link: ${url}`,
                attachment: fs.createReadStream(filename),
            },
            event.threadID,
            () => fs.unlinkSync(filename) // Delete the file after sending
        );
    } catch (error) {
        api.sendMessage('An error occurred while converting the media.', event.threadID, event.messageID);
        console.error(error);
    }
};
