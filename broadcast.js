const { Bot } = require("grammy");
const fs = require("fs");
const csv = require("csv-parser");

const bot = new Bot("7115276113:AAFLkVfctU3QuesH6We_jVyw5peIcLMYRBc");
const groupIds = [];
let isRunning = false;
let checkInterval;

// 获取当前时间（HH:mm）
const getCurrentTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
    ).padStart(2, "0")}`;
};

const checkCSV = async () => {
    if (isRunning) return;
    isRunning = true;

    try {
        const dataArray = [];
        await new Promise((resolve, reject) => {
            fs.createReadStream("jobs.csv")
                .pipe(csv({ headers: false }))
                .on("data", (row) => {
                    dataArray.push({
                        time: row[0],
                        content: row[1]
                    });
                })
                .on("end", resolve)
                .on("error", reject);
        });

        const currentTime = getCurrentTime();
        for (const item of dataArray) {
            if (item.time === currentTime) {
                let content = item.content;
                // 提取 URL
                let urlRegex = /\[([^[\]]*)\]/;
                let match = content.match(urlRegex);
                let url = match ? match[1] : null;
                content = content.replace(/image=\[.*?\]/, "");

                for (const groupId of groupIds) {
                    try {
                        if (url) {
                            await bot.api.sendMediaGroup(groupId, [{
                                type: "photo",
                                media: url,
                                caption: content
                            }]);
                        } else {
                            await bot.api.sendMessage(groupId, content);
                        }
                    } catch (err) {
                        console.error(`发送消息到群组 ${groupId} 失败:`, err);
                    }
                }
            }
        }
    } catch (err) {
        console.error("处理CSV文件出错:", err);
    } finally {
        isRunning = false;
    }
};

const startChecker = () => {
    // 先清除已有定时器
    if (checkInterval) clearInterval(checkInterval);

    // 立即执行一次
    checkCSV();

    // 设置定时检查
    checkInterval = setInterval(checkCSV, 15000);
    console.log("定时检查已启动，每15秒检查一次");
};

bot.command("start", (ctx) => {
    const chatId = ctx.message.chat.id;
    if (!groupIds.includes(chatId)) {
        groupIds.push(chatId);
        ctx.reply("start success");
    }
});

// 文件监听
fs.watchFile("jobs.csv", { persistent: false }, (curr, prev) => {
    if (curr.mtime !== prev.mtime) {
        console.log("CSV文件发生变化，重新加载...");
        startChecker();
    }
});

bot.start();
startChecker();