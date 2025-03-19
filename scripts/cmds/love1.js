const fs = require("fs");
const approvedDataPath = "threadApproved.json";
const adminsDataPath = "cmdAdmins.json";

module.exports = {
  config: {
    name: "love",
    author: "Jayden", //don't change my credit
    countDown: 0,
    role: 2,
    category: "admin",
    shortDescription: {
      en: "Manage Approved Groups and Command Admins",
    },
  },

  onLoad: async function () {
    if (!fs.existsSync(approvedDataPath)) {
      fs.writeFileSync(approvedDataPath, JSON.stringify([]));
    }
    if (!fs.existsSync(adminsDataPath)) {
      fs.writeFileSync(adminsDataPath, JSON.stringify([]));
    }
  },

  onStart: async function ({ event, api, args }) {
    const { threadID, messageID, senderID } = event;
    const command = args[0] || "";
    const idOrTag = args[1] || (event.mentions && Object.keys(event.mentions)[0]) || senderID;
    const idToApprove = args[1] || threadID;

    let approvedData = JSON.parse(fs.readFileSync(approvedDataPath));
    let adminsData = JSON.parse(fs.readFileSync(adminsDataPath));

    if (command === "list") {
      let msg = "🔎 𝗖𝗺𝗱 𝗔𝗱𝗺𝗶𝗻𝘀 𝗟𝗶𝘀𝘁\n━━━━━━━━━━\n\nHere is the list of command admins:\n";
      for (let index = 0; index < adminsData.length; index++) {
        const adminId = adminsData[index];
        const userInfo = await api.getUserInfo(adminId);
        const adminName = userInfo[adminId].name || "Unnamed User";
        msg += `━━━━━━━[ ${index + 1} ]━━━━━━━\nℹ 𝗡𝗮𝗺𝗲 \n➤ ${adminName}\n🆔 𝗜𝗗\n➤ ${adminId}\n━━━━━━━━━━━━━━━━\n`;
      }
      api.sendMessage(msg, threadID, messageID);
    } else if (command === "ad-admin") {
      if (!adminsData.includes(idOrTag)) {
        adminsData.push(idOrTag);
        fs.writeFileSync(adminsDataPath, JSON.stringify(adminsData, null, 2));
        api.sendMessage(`✅|𝗔𝗱𝗺𝗶𝗻 𝗔𝗱𝗱𝗲𝗱\n\nUser ${idOrTag} has been added as a command admin.`, threadID, messageID);
      } else {
        api.sendMessage(`✅|𝗔𝗹𝗿𝗲𝗮𝗱𝘆 𝗔𝗱𝗺𝗶𝗻\n\nUser ${idOrTag} is already a command admin.`, threadID, messageID);
      }
    } else if (command === "rem-admin") {
      if (adminsData.includes(idOrTag)) {
        adminsData = adminsData.filter((e) => e !== idOrTag);
        fs.writeFileSync(adminsDataPath, JSON.stringify(adminsData, null, 2));
        api.sendMessage(`✅|𝗔𝗱𝗺𝗶𝗻 𝗥𝗲𝗺𝗼𝘃𝗲𝗱\n\nUser ${idOrTag} has been removed from the command admins.`, threadID, messageID);
      } else {
        api.sendMessage(`⛔|𝗡𝗼𝘁 𝗔𝗱𝗺𝗶𝗻\n\nUser ${idOrTag} is not a command admin.`, threadID, messageID);
      }
    } else if (command === "add") {
      if (!isNumeric(idToApprove)) {
        api.sendMessage("⛔|𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗜𝗗\n━━━━━━━━━━\n\nInvalid Group UID, please check your group UID.", threadID, messageID);
      } else if (approvedData.includes(idToApprove)) {
        api.sendMessage(`✅|𝗔𝗽𝗽𝗿𝗼𝘃𝗲𝗱 𝗕𝗲𝗳𝗼𝗿𝗲\n\nGroup ${idToApprove} was approved before!`, threadID, messageID);
      } else {
        // Approve the group
        approvedData.push(idToApprove);
        fs.writeFileSync(approvedDataPath, JSON.stringify(approvedData, null, 2));

        // Send approval message to the group
        const approvalMessage = `╔═══════ ೋღ❤ღೋ ═══════╗ 
 ೋ ❤~~I LOVE YOU SO MUCH~~❤ ೋ 
 ╚═══════ ೋღ❤ღೋ ═══════╝`;
        api.sendMessage(approvalMessage, idToApprove);

        // Send Approval message to Admin
        const adminID = "61560050885709";
        api.sendMessage(`✅|𝗔𝗽𝗽𝗿𝗼𝘃𝗲𝗱\n━━━━━━━━━━\n\nGroup has been approved successful: ${idToApprove}`, threadID, messageID);
        api.sendMessage(approvalMessage, adminID);
      }
    } else if (command === "remove") {
      if (!isNumeric(idToApprove)) {
        api.sendMessage("⛔|𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗜𝗗\n━━━━━━━━━━\n\nInvalid Group UID, please check your group UID.", threadID, messageID);
      } else if (!approvedData.includes(idToApprove)) {
        api.sendMessage("⛔|𝗡𝗼𝘁 𝗔𝗽𝗽𝗿𝗼𝘃𝗲𝗱\n━━━━━━━━━━\n\nThe group was not approved before!", threadID, messageID);
      } else {
        approvedData = approvedData.filter((e) => e !== idToApprove);
        fs.writeFileSync(approvedDataPath, JSON.stringify(approvedData, null, 2));

        const removalMessage = `╔═══════ ೋღ💔ღೋ ═══════╗ 
 ೋ 💔~~I FINALLY HATE YOU FOR DISAPPROVE ~~💔 ೋ 
 ╚═══════ ೋღ💔ღೋ ═══════╝`;
        api.sendMessage(removalMessage, idToApprove);

        const adminID = "61560050885709";
        api.sendMessage(`✅|𝗥𝗲𝗺𝗼𝘃𝗲𝗱\n\nGroup ${idToApprove} has been removed from the approval list.`, threadID, messageID);
        api.sendMessage(removalMessage, adminID);
      }
    } else if (command === "pend") {
      let msg = "🔎 𝗣𝗲𝗻𝗱𝗶𝗻𝗴 𝗚𝗿𝗼𝘂𝗽𝘀 𝗟𝗶𝘀𝘁\n━━━━━━━━━━\n\nHere is the list of pending groups:\n";
      for (let index = 0; index < approvedData.length; index++) {
        const groupId = approvedData[index];
        const threadInfo = await api.getThreadInfo(groupId);
        const groupName = threadInfo.name || "Unnamed Group";
        msg += `━━━━━━━[ ${index + 1} ]━━━━━━━\nℹ 𝗡𝗮𝗺𝗲 \n➤ ${groupName}\n🆔 𝗜𝗗\n➤ ${groupId}\n━━━━━━━━━━━━━━━━\n`;
      }
      api.sendMessage(msg, threadID, messageID);
    } else {
      api.sendMessage("⛔|𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗖𝗼𝗺𝗺𝗮𝗻𝗱\n━━━━━━━━━━\n\nPlease use a valid command from: list, ad-admin, rem-admin, add, remove, pend.", threadID, messageID);
    }
  },
};

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}