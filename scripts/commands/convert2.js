const axios = require('axios');
const fs = require('fs');

module.exports.config = {
    name: "dl",
    version: "1.0.0",
    permission: 2,
    credits: "Rahad",
    description: "Convert media from a Google Drive link",
    prefix: true, 
    category: "Media", 
    usages: "/Convert [link]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs": ""
    }
};

module.exports.run = async function ({ api, event, args }) {
    const url = args[0];

    if (!url) {
        return api.sendMessage('Please provide a valid Google Drive link to convert media from.', event.threadID, event.messageID);
    }
  
    try {
        // Extract the file ID from the provided URL
        const fileId = url.match(/\/d\/([^/]+)/)[1];
        // Construct the download URL
        const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

        // Follow redirects to capture the final URL
        const response = await axios.head(downloadUrl, { maxRedirects: 5 });

        if (response.status !== 200) {
            return api.sendMessage('Failed to fetch the media from the provided link.', event.threadID, event.messageID);
        }

        const finalUrl = response.request.res.responseUrl;

        // Send the message with the download link
        api.sendMessage(
            {
                body: `✅ Download Link: ${finalUrl}`,
            },
            event.threadID
        );
    } catch (error) {
        api.sendMessage('An error occurred while converting the media.', event.threadID, event.messageID);
        console.error(error);
    }
};
