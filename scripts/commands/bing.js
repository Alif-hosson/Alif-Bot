module.exports.config = {
  name: "bing",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Nayan",
  description: "",
  category: "Image",
  usages: "bing cat",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const prompt = args.join(" ");
    const key = this.config.credits;
    if (!args.length) return api.sendMessage('Usage: /bing [prompt]', event.threadID, event.messageID); 

    const rndm = ['SRCHHPGUSR=SRCHLANG=en&CW=360&CH=636&SCW=360&SCH=636&BRW=MM&BRH=MM&DPR=2.0&UTC=360&HV=1711912168&PRVCW=360&PRVCH=636&DM=1'];  //input cooki here
    var cookie = rndm[Math.floor(Math.random() * rndm.length)];

    const res = await axios.get(`https://bing-api-5dpl.onrender.com/bing-img?key=${key}&cookie=${cookie}&prompt=${encodeURIComponent(prompt)}`);

    console.log(res.data);
    const data = res.data.result;
    const numberSearch = data.length;
    var num = 0;
    var imgData = [];
    for (var i = 0; i < parseInt(numberSearch); i++) {
        let path = __dirname + `/cache/${num}.jpg`;
        let getDown = (await axios.get(`${data[i]}`, { responseType: 'arraybuffer' })).data;
        fs.writeFileSync(path, Buffer.from(getDown, 'utf-8'));
        imgData.push(fs.createReadStream(__dirname + `/cache/${num}.jpg`));
        num += 1;
    }

    await api.sendMessage({
        attachment: imgData,
        body: "Bing Search Result\n\nPrompt: " + prompt + "\n\n#Number of Images: " + numberSearch
    }, event.threadID, event.messageID); 

    for (let ii = 0; ii < parseInt(numberSearch); ii++) {
        fs.unlinkSync(__dirname + `/cache/${ii}.jpg`);
    }
};
