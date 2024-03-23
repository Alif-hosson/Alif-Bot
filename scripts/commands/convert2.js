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
        const fileId = url.match(/\/d\/([^/]+)/)[1];
        const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
        
        const response = await axios.head(downloadUrl, { maxRedirects: 5 });

        if (response.status !== 200) {
            return api.sendMessage('Failed to fetch the media from the provided link.', event.threadID, event.messageID);
        }

        const finalUrl = response.request.res.responseUrl;
        
        const { data: fileStream } = await axios.get(finalUrl, { responseType: 'stream' });

        api.sendMessage(
            {
                body: `✅ Download Link: ${finalUrl}`,
                attachment: fileStream,
            },
            event.threadID, event.messageID);
        );
    } catch (error) {
        api.sendMessage('An error occurred while converting the media.', event.threadID, event.messageID);
        console.error(error);
    }
};
