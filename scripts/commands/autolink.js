module.exports.config = {
  name: "awto",
  version: "1.0.0",
  permission: 0,
  prefix: true,
  credits: "Nayan",
  description: "Social Media Video Downloader",
  category: "user",
  usages: "[url]",
  cooldowns: 5,
  dependencies: {
        'nayan-media-downloader': '',
  }
};

  module.exports.handleEvent = async function ({ api, event, args }) {
  const axios = require("axios");
  const fs = require("fs-extra");
 const content = event.body ? event.body : '';
    const body = content.toLowerCase();
    
    
  const { ytdown, ndown, tikdown, twitterdown } = require("nayan-media-downloader")
  let msg = "";

  if (module.exports.config.credits !== "Nayan") {
    return api.sendMessage(
      "Warning: You have changed the credits value. Please replace it with the original one.",
      event.threadID,
      event.messageID
    );
  }

  const sendWaitingMessage = async (message) => {

    return await api.sendMessage({ ...message }, event.threadID);
  };

  if (body.startsWith("https://fb.watch/") || body.startsWith("https://www.facebook.com")) {
    const fbApiResponse = await ndown(body);
    console.log(fbApiResponse)
    const fbVideoUrl = fbApiResponse.data[0].url;
    api.setMessageReaction("✅", event.messageID, (err) => {}, true);
    const waitingMessage = await sendWaitingMessage({ body: "Downloading Facebook video. Please wait..." });
    

    const fbVideoData = (await axios.get(fbVideoUrl, {
      responseType: "arraybuffer",
    })).data;
    fs.writeFileSync(__dirname + "/cache/fbVideo.mp4", Buffer.from(fbVideoData, "utf-8"));

    msg = "Facebook video download success";

    api.sendMessage(
      {
        body: msg,
        attachment: fs.createReadStream(__dirname + "/cache/fbVideo.mp4"),
      },
      event.threadID
    );

    setTimeout(() => {
      api.unsendMessage(waitingMessage.messageID);
    }, 9000);
  } else if (
    body.startsWith("https://vt.tiktok.com/") ||
    body.startsWith("https://tiktok.com/") ||
    body.startsWith("https://www.tiktok.com")
  ) {
    const tiktokApiResponse = await tikdown(event.body);
    const tiktokVideoUrl = tiktokApiResponse.data.video;
    const tiktokTitle = tiktokApiResponse.data.title;
    const tiktokavatar = tiktokApiResponse.data.author.avatar;
    console.log(tiktokApiResponse)
    const tiktokAvatar = (
      await axios.get(`${tiktokavatar}`,
        { responseType: 'stream' }
      )
    ).data;
    api.setMessageReaction("✅", event.messageID, (err) => {}, true);
    const waitingMessage = await sendWaitingMessage({ body: "Downloading TikTok video. Please wait....!🥱🌸"});
    

    const tiktokVideoData = (await axios.get(tiktokVideoUrl, {
      responseType: "arraybuffer",
    })).data;
    fs.writeFileSync(__dirname + "/cache/tiktokVideo.mp4", Buffer.from(tiktokVideoData, "utf-8"));

    msg = `《TITLE》${tiktokTitle}`;

    api.sendMessage(
      {
        body: msg,
        attachment: fs.createReadStream(__dirname + "/cache/tiktokVideo.mp4"),
      },
      event.threadID
    );

    setTimeout(() => {
      api.unsendMessage(waitingMessage.messageID);
    }, 9000);
  } else if (body.startsWith("https://instagram.com") || body.startsWith("https://www.instagram.com")) {
    const instagramApiResponse = await ndown(event.body);
    const instagramVideoUrl = instagramApiResponse.data[0].url;
    api.setMessageReaction("✅", event.messageID, (err) => {}, true);
    const waitingMessage = await sendWaitingMessage({ body: "Downloading Instagram video. Please wait..." });

    const instagramVideoData = (await axios.get(instagramVideoUrl, {
      responseType: "arraybuffer",
    })).data;
    fs.writeFileSync(__dirname + "/cache/instagramVideo.mp4", Buffer.from(instagramVideoData, "utf-8"));

    msg = "Instagram video download success";

    api.sendMessage(
      {
        body: msg,
        attachment: fs.createReadStream(__dirname + "/cache/instagramVideo.mp4"),
      },
      event.threadID
    );

    setTimeout(() => {
      api.unsendMessage(waitingMessage.messageID);
    }, 9000);
  } else if (body.startsWith("https://youtube.com/shorts/") || body.startsWith("https://youtu.be/")) {
    // YouTube video download logic
    const youtubeApiResponse = await ytdown(event.body);
    const youtubeVideoUrl = youtubeApiResponse.data.video;
    const title = youtubeApiResponse.data.title;
    api.setMessageReaction("✅", event.messageID, (err) => {}, true);
    const waitingMessage = await sendWaitingMessage({ body: "Downloading YouTube video. Please wait..." });
    const youtubeVideoData = (await axios.get(youtubeVideoUrl, {
      responseType: "arraybuffer",
    })).data;
    fs.writeFileSync(__dirname + "/cache/youtubeVideo.mp4", Buffer.from(youtubeVideoData, "utf-8"));

    msg = `YouTube video download success\n${title}`;

    api.sendMessage(
      {
        body: msg,
        attachment: fs.createReadStream(__dirname + "/cache/youtubeVideo.mp4"),
      },
      event.threadID
    );

    setTimeout(() => {
      api.unsendMessage(waitingMessage.messageID);
    }, 9000);
  } else if (body.startsWith("https://twitter.com/")) {
    const instagramApiResponse = await twitterdown(event.body);
    const twitterVideoUrl = instagramApiResponse.data.HD;
    api.setMessageReaction("✅", event.messageID, (err) => {}, true);
    const waitingMessage = await sendWaitingMessage({ body: "Downloading Twitter video. Please wait..." });

    const TWITTEEVideoData = (await axios.get(twitterVideoUrl, {
      responseType: "arraybuffer",
    })).data;
    fs.writeFileSync(__dirname + "/cache/instagramVideo.mp4", Buffer.from(TWITTEEVideoData, "utf-8"));

    msg = "Twitter video download success";

    api.sendMessage(
      {
        body: msg,
        attachment: fs.createReadStream(__dirname + "/cache/instagramVideo.mp4"),
      },
      event.threadID
    );

    setTimeout(() => {
      api.unsendMessage(waitingMessage.messageID);
    }, 9000);
  } 
    } 
module.exports.run = function({ api, event, client, __GLOBAL }) {

      }
