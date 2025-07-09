const { Bot } = require("grammy");
const fs = require("fs");

const data = fs.readFileSync("sensitive_words.txt", "utf8");

// 将文件内容按换行符分割成数组
const sensitiveWords = data.split("\r\n");

// 将每个敏感词转换为大写
const uppercaseWords = sensitiveWords.map((word) => word.toUpperCase());

console.log(uppercaseWords);

function containsSensitiveWord(text) {
    // 将输入文本转换为大写以进行匹配
    const uppercaseText = text.toUpperCase();
    console.log(uppercaseText);
    // 检查输入文本是否包含任何敏感词
    return uppercaseWords.some(word => uppercaseText.includes(word));
}
//Create a new bot
const bot = new Bot("your token");
//This function would be added to the dispatcher as a handler for messages coming from the Bot API
bot.on("message", async (ctx) => {
    //Print to console
    console.log(
        `${ctx.from.first_name} wrote ${"text" in ctx.message ? ctx.message.text : ""
        }`
    );
    if (ctx.message.text) {
        console.log(JSON.stringify(ctx));
        let bool = containsSensitiveWord(ctx.message.text);
        console.log('是否敏感词', bool);
        if (bool) {
            try {
                let id = ctx.from.id;
                // 本群将某人拉黑
                ctx.banChatMember(id).then().catch(err=>{
                    console.log(err);
                });
                // 删除敏感信息
                ctx.deleteMessage().then().catch(err=>{
                    console.log(err);
                });
            } catch (e) {
                console.log(e);
            }
        }
    }
});

//Start the Bot
bot.start();
