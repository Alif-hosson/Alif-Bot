module.exports.config = {
    name: "gitinfo",
    version: "1.0.0",
    permission: 0,
    credits: "Rahad",
    description: "Collects information from GitHub user",
    prefix: true, 
    category: "Utility", 
    usages: "gitinfo",
    cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const content = args.join(" ");
    
    try {
        const res = await axios.get(`https://api.github.com/users/${content}`);
        const r = res.data;
        
        const a = r.login;
        const h = r.avatar_url;
        const d = r.name || "Not specified";
        const rahad = r.company || "Not specified";
        const rahad2 = r.blog || "Not specified";
        const rahad3 = r.location || "Not specified";
        const rahad4 = r.email || "Not specified";
        const rahad5 = r.hireable ? "Yes" : "No";
        const rahad6 = r.bio || "Not specified";
        const rahad8 = r.public_repos;
        const rahad9 = r.public_gists;
        const rahad10 = r.followers;
        const rahad11 = r.following;
        const rahad12 = r.created_at;
        const rahad13 = r.updated_at;
        
        const videoResponse = await axios.get(h, { responseType: 'stream' });
        const videoStream = videoResponse.data;
        
        const videoFileName = __dirname + "/cache/avatar.png";
        const writeStream = fs.createWriteStream(videoFileName);
        
        videoStream.pipe(writeStream);
        
        writeStream.on("finish", () => {
            const msg = `USER NAME: ${a}\n\nNAME: ${d}\n\nCOMPANY: ${rahad}\n\nBLOG: ${rahad2}\n\nLOCATION: ${rahad3}\n\n EMAIL: ${rahad4}\n\nHIREABLE: ${rahad5}\n\nBIO: ${rahad6}\n\nPUBLIC REPOS: ${rahad8}\n\nPUBLIC GISTS: ${rahad9}\n\nFOLLOWERS: ${rahad10}\n\nFOLLOWING: ${rahad11}\n\nCREATED AT: ${rahad12}\n\nUPDATED AT: ${rahad13}`;
            
            return api.sendMessage({
                body: msg,
                attachment: fs.createReadStream(videoFileName)
            }, event.threadID, (error, info) => {
                if (error) {
                    console.error("Error sending the Information:", error);
                }
                fs.unlinkSync(videoFileName); 
            });
        });
    } catch (error) {
        console.error("Error fetching and sending information:", error);
        return api.sendMessage("An error occurred while fetching and sending the information", event.threadID);
    }
};
