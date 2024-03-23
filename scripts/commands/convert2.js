const axios = require('axios');
const fs = require('fs');

module.exports.config = {
    name: "dl",
    version: "1.0.0",
    permission: 2,
    credits: "Rahad",
    description: "Download media from a Google Drive link",
    prefix: true, 
    category: "Media", 
    usages: "/dl [Google Drive link]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs": ""
    }
};

module.exports.run = async function ({ api, event, args }) {
    const url = args[0];

    if (!url) {
        return api.sendMessage('Please provide a valid Google Drive link.', event.threadID, event.messageID);
    }
  
    try {
        // Modify the Google Drive link to a direct download link
        const directDownloadLink = modifyToDirectDownloadLink(url);

        // Fetch the media content from the modified direct download link
        const response = await axios.get(directDownloadLink, { responseType: 'arraybuffer' });

        if (response.status !== 200) {
            return api.sendMessage('Failed to fetch the media from the provided link.', event.threadID, event.messageID);
        }

        // Generate a random filename with the same extension as the original file
        const filename = `downloaded${getFileExtension(url)}`;
        
        // Write the downloaded data to a file
        fs.writeFileSync(filename, Buffer.from(response.data, 'binary'));

        // Send the downloaded file as an attachment
        api.sendMessage(
            {
                body: `Downloaded media from the provided link: ${url}`,
                attachment: fs.createReadStream(filename),
            },
            event.threadID,
            () => fs.unlinkSync(filename) // Delete the file after sending
        );
    } catch (error) {
        api.sendMessage('An error occurred while downloading the media.', event.threadID, event.messageID);
        console.error(error);
    }
};

// Function to modify Google Drive link to a direct download link
function modifyToDirectDownloadLink(originalLink) {
    const fileId = originalLink.match(/\/d\/(.+?)\//)[1];
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

// Function to get the file extension from a URL
function getFileExtension(url) {
    return url.split('.').pop();
}
