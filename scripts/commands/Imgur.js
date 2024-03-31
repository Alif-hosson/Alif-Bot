const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const url = require('url');
const moment = require("moment-timezone");

module.exports.config = {
    name: "imgur",
    version: "1.0.0",
    permission: 0,
    credits: "Rahad",
    description: "Uploads replied attachment to Imgur",
    prefix: true, 
    category: "Video and images Imgur upload", 
    usages: "imgur",
    cooldowns: 5,
    dependencies: {
        "axios": ""
    }
};

module.exports.run = async ({ api, event }) => {
    try {
        const attachmentUrl = event.messageReply.attachments[0].url;
        if (!attachmentUrl) return api.sendMessage('Please reply to an image or video with /imgur', event.threadID, event.messageID);

        const momentDhaka = moment.tz("Asia/Dhaka");
        var times = momentDhaka.format("hh:mm:ss || D/MM/YYYY");
        var thu = momentDhaka.format("dddd");
        if (thu == "Sunday") thu = "𝚂𝚞𝚗𝚍𝚊𝚢";
        if (thu == "Monday") thu = "𝙼𝚘𝚗𝚍𝚊𝚢";
        if (thu == "Tuesday") thu = "𝚃𝚞𝚎𝚜𝚍𝚊𝚢";
        if (thu == "Wednesday") thu = "𝚆𝚎𝚍𝚗𝚎𝚜𝚍𝚊𝚢";
        if (thu == "Thursday") thu = "𝚃𝚑𝚞𝚛𝚜𝚍𝚊𝚢";
        if (thu == "Friday") thu = "𝙵𝚛𝚒𝚍𝚊𝚢";
        if (thu == "Saturday") thu = "𝚂𝚊𝚝𝚞𝚛𝚍𝚊𝚢";
        var { threadID, messageID, body } = event,
            { PREFIX } = global.config;
        let threadSetting = global.data.threadData.get(threadID) || {};
        let prefix = threadSetting.PREFIX || PREFIX;
        const timeStart = Date.now();

        const links = [
            "https://i.imgur.com/Jm8GFpy.jpeg",
            "https://i.imgur.com/lp2Lmcy.jpeg",
            "https://i.imgur.com/AnCVD2z.jpeg",
            "https://i.imgur.com/Nq89l5D.jpeg",
            "https://i.imgur.com/XAjyUXX.jpeg",
            "https://i.imgur.com/2EmEdcM.jpeg",
            "https://i.imgur.com/5FRxF87.jpeg",
            "https://i.imgur.com/mL8daC8.jpeg",
            "https://i.imgur.com/UUKzEhx.jpeg",
            "https://i.imgur.com/K8Eft54.jpeg",
            "https://i.imgur.com/O6sZdo1.jpeg",
            "https://i.imgur.com/rQa5omU.jpeg",
            "https://i.imgur.com/DpY4run.jpeg",
            "https://i.imgur.com/ESrHa8w.jpeg",
            "https://i.imgur.com/gcyTZOW.jpeg",
            "https://i.imgur.com/nUtBpq8.jpeg",
            "https://i.imgur.com/bLMtfeD.jpeg",
            "https://i.imgur.com/QRtsGYt.jpeg"
        ];

        const randomLink = links[Math.floor(Math.random() * links.length)];
        const attachment = (await axios.get(randomLink, { responseType: 'arraybuffer' })).data;

        const { path } = await download(attachmentUrl);

        console.log('Attachment downloaded:', path);

        const imgurLink = await uploadToImgur(path);

        console.log('Imgur link:', imgurLink);

        const replyMessage = `====『 𝖨𝖬𝖦𝖴𝖱 』====\n
        ▱▱▱▱▱▱▱▱▱▱▱▱▱\n
        ✿ 𝖨𝗆𝗀𝗎𝗋 𝗅𝗂𝗇𝗄: ${imgurLink}\n
        ▱▱▱▱▱▱▱▱▱▱▱▱▱\n
        『  ${thu} || ${times} 』`;

        return api.sendMessage({ body: replyMessage, attachment: attachment }, event.threadID, event.messageID);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        return api.sendMessage('An error occurred while processing the attachment.', event.threadID, event.messageID);
    }
};

async function download(url) {
    return new Promise((resolve, reject) => {
        let path;
        axios({
            url,
            method: 'GET',
            responseType: 'stream'
        }).then(response => {
            const parsedUrl = url.parse(url);
            const ext = parsedUrl.pathname.split('.').pop().toLowerCase();
            path = `./${Date.now()}.${ext}`;
            response.data.pipe(fs.createWriteStream(path));
            response.data.on('end', () => {
                console.log('Download completed:', path);
                resolve({ path });
            });
        }).catch(error => {
            console.error('Download error:', error);
            reject(error);
        });
    });
}

async function uploadToImgur