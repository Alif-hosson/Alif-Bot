const fs = require("fs");

module.exports.config = {
  name: "poddoja",
  version: "1.0.0",
  permission: 0,
  credits: "Rahad",
  description: "poddoja upornas",
  prefix: true,
  category: "text",
  usages: "<number page>",
  cooldowns: 5,
  dependencies: {}
};

module.exports.run = async ({ api, event, args }) => {
  const filePath = "./../../rahad/prefix.txt"; 
  try {
    const fileData = fs.readFileSync(filePath, "utf-8");
    const pages = fileData.split("\n\n"); 
    if (args.length === 0 || isNaN(args[0])) {
      return api.sendMessage("Please provide a valid page number.", event.threadID);
    }

    const pageNumber = parseInt(args[0]);
    if (pageNumber < 1 || pageNumber > pages.length) {
      return api.sendMessage("Page not found.", event.threadID);
    }

    const pageIndex = pageNumber - 1; 
    const pageContent = pages[pageIndex];
    api.sendMessage(pageContent, event.threadID);
  } catch (error) {
    console.error("Error reading prefix.txt:", error);
    return api.sendMessage("An error occurred while processing your request.", event.threadID);
  }
};
