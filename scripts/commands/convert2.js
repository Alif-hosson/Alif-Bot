const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "dl",
    version: "1.0.0",
    permission: 2,
    credits: "Rahad",
    description: "Convert media from a link (supports jpeg, jpg, png, mp4, gif, wav)",
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
        return api.sendMessage('Please provide a valid link to convert media from.', event.threadID, event.messageID);
    }

    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });

        if (response.status !== 200) {
            return api.sendMessage('Failed to fetch the media from the provided link.', event.threadID, event.messageID);
        }

        // Extract the file name from the URL
        const filename = path.basename(url);

        fs.writeFileSync(filename, Buffer.from(response.data, 'binary'));

        api.sendMessage(
            {
                body: `Converted media from the provided link: ${url}`,
                attachment: fs.createReadStream(filename),
            },
            event.threadID,
            () => fs.unlinkSync(filename)
        );
    } catch (error) {
        api.sendMessage('An error occurred while converting the media.', event.threadID, event.messageID);
        console.error(error);
    }
};
