const axios = require('axios');
const fs = require('fs');
const { PNG } = require('pngjs'); 
const jsQR = require('jsqr'); 

module.exports.config = {
    name: "qrinfo",
    version: "1.0.0",
    permission: 0,
    credits: "Rahad",
    description: "Collects information from QR code pictures",
    prefix: true, 
    category: "Utility", 
    usages: "qrinfo",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "jsqr": "",
        "pngjs": "" 
    }
};

module.exports.run = async ({ api, event }) => {
    try {
        const attachmentUrl = event.messageReply.attachments[0]?.url || event.messageReply.attachments[0];
        console.log('Received attachment URL:', attachmentUrl);

        if (!attachmentUrl) return api.sendMessage('Please reply to a QR code picture with /qrinfo', event.threadID, event.messageID);

        const { path } = await download(attachmentUrl);
        console.log('Attachment downloaded:', path);

        const qrCodeInfo = await decodeQRCode(path);
        console.log('QR code information:', qrCodeInfo);

        if (!qrCodeInfo) {
            console.error('Failed to decode the QR code.');
            return api.sendMessage('Failed to decode the QR code.', event.threadID, event.messageID);
        }

        const replyMessage = `Collected information from QR code:\n${qrCodeInfo}`;
        console.log('Constructed message:', replyMessage);

        return api.sendMessage(replyMessage, event.threadID);
    } catch (error) {
        console.error('Error:', error);
        return api.sendMessage('An error occurred while processing the QR code.', event.threadID, event.messageID);
    }
};

async function download(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const timestamp = Date.now();
    const path = `./${timestamp}.png`;
    fs.writeFileSync(path, Buffer.from(response.data));
    return { path };
}

function decodeQRCode(imagePath) {
    return new Promise((resolve, reject) => {
        try {
            const buffer = fs.readFileSync(imagePath);
            const png = new PNG();
            png.parse(buffer, (error, data) => {
                if (error) {
                    console.error('Error parsing PNG:', error);
                    reject(error);
                    return;
                }
                const imageData = new Uint8ClampedArray(data.data.buffer);
                const code = jsQR(imageData, data.width, data.height);
                if (code) {
                    resolve(code.data);
                } else {
                    reject(new Error('Failed to decode QR code.'));
                }
            });
        } catch (error) {
            console.error('Error reading file:', error);
            reject(error);
        }
    });
}
