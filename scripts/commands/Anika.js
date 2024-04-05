const axios = require("axios");

module.exports.config = {
    name: "Anika",
    version: "1.0.0",
    permission: 0,
    credits: "Rahad",
    description: "Talk to Ana",
    prefix: true,
    category: "sim simi fun",
    usages: "Anika",
    cooldowns: 5,
    dependencies: {
        "request": "",
        "fs-extra": "",
        "axios": ""
    }
};

module.exports.handleEvent = async ({ api, event, Threads }) => {
    const content = event.body ? event.body : '';
    const body = content.toLowerCase();
    if (body.startsWith("anika")) {
        const args = event.body.split(/\s+/);
        args.shift();

        let { messageID, threadID, senderID } = event;
        let tid = threadID,
            mid = messageID;
        const message = encodeURIComponent(args.join(" "));
        if (!args[0]) return api.sendMessage(" hm bolo bby😸 ...", tid, mid);
        try {
            const res = await axios.get(`https://simsimi.fun/api/v2/?mode=talk&lang=bn&message=${message}&filter=true`);
            const respond = res.data.success;
            if (res.data.error) {
                api.sendMessage(`Error: ${res.data.error}`, tid, (error, info) => {
                    if (error) {
                        console.error(error);
                    }
                }, mid);
            } else {
                api.sendMessage(respond, tid, (error, info) => {
                    if (error) {
                        console.error(error);
                    }
                }, mid);
            }
        } catch (error) {
            console.error(error);
            api.sendMessage("🤖 𝙰𝚗 𝚎𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚎𝚍 𝚠𝚑𝚒𝚕𝚎 𝚐𝚎𝚝𝚝𝚒𝚗𝚐 𝙳𝚊𝚝𝚊𝚋𝚊𝚜𝚎, 𝚜𝚘𝚛𝚛𝚢 𝚋𝚊𝚋𝚎 🥺", tid, mid);
        }
    }
};

module.exports.run = async function ({ api, event }) {};
