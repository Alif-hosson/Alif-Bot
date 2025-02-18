 module.exports = {
  config: {
    name: "bing",
    version: "1.0.0",
    permission: 0,
    credits: "Nayan",
    description: "",
    prefix: 'awto',
    category: "auto prefix",
    usages: "bing prompt",
    cooldowns: 10,
},

   languages: {
   "vi": {},
       "en": {
           "missing": 'use : /bing cat'
       }
   },

start: async function({ nayan, events, args, lang}) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const request = require("request");
    const prompt = args.join(" ");
    const key = this.config.credits;
    const apis = await axios.get('https://raw.githubusercontent.com/MR-NAYAN-404/NAYAN-BOT/main/api.json')
  const n = apis.data.api2
    if(!prompt) return nayan.reply(lang('missing'), events.threadID, events.messageID)

  const rndm = ['1VD95z05ScFZXe3oXkS83aEsZOOFP0n96A1seqIJZn3dGtCR18wV3rVe8QO_KlDVotA-EOJeRMg0t56gjbcZnfc4ufo51k1jlPRZ9wdeYYNTgpWP5fyziq7SUGdvbALI0MWQ2EksCbWfWIhoCT3QwW2XrG9n0EOvcy69Sf2X1B-BGiIXLgbqL0ro0DXJNhEUGVRIXRoU08WRKuQbvUFYhMg','1HLeQjPG434srEEz8GLU-6w-2K355LRuokMZA9ovE4L0BwLiGgJCmJ33OLoCqVvjWSj8Y0ZCYAdTDgJXZVf7e1x6o4f02gipc-LijaMt0Lm2QxrlpbOcx1FFcXUANFYSQuYO64AQ458CO5mk66nC0-XQm67kqx_7iKVp4CfmHTu88gTIoV_9GhYQk_ooHC6vxvigaN1fv0iy4FgoivOLjKg','SRCHHPGUSR=SRCHLANG=en&CW=360&CH=636&SCW=360&SCH=636&BRW=MM&BRH=MM&DPR=2.0&UTC=360&HV=1711912168&PRVCW=360&PRVCH=636&DM=1'] // input your cookie hare

  var cookie = rndm[Math.floor(Math.random() * rndm.length)];


    const res = await axios.get(`${n}/bing-img?key=${key}&cookie=${cookie}&prompt=${encodeURIComponent(prompt)}`);

  
  console.log(res.data)
    const data = res.data.result;
  const numberSearch = data.length
    var num = 0;
    var imgData = [];
    for (var i = 0; i < parseInt(numberSearch); i++) {
      let path = __dirname + `/cache/${num+=1}.jpg`;
      let getDown = (await axios.get(`${data[i]}`, { responseType: 'arraybuffer' })).data;
      fs.writeFileSync(path, Buffer.from(getDown, 'utf-8'));
      imgData.push(fs.createReadStream(__dirname + `/cache/${num}.jpg`));
    }

    
    nayan.reply({
        attachment: imgData,
        body: "🔍Bing Search Result🔍\n\n📝Prompt: " + prompt + "\n\n#️⃣Number of Images: " + numberSearch
    }, events.threadID, events.messageID)
    for (let ii = 1; ii < parseInt(numberSearch); ii++) {
        fs.unlinkSync(__dirname + `/cache/${ii}.jpg`)
    }
}
 }
