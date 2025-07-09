## 替换机器人token
  自行注册机器人后替换token即可，然后把机器人拉到群组中赋予管理员权限
  
## 监控群敏感词：sensitive_words.js
1. 在sensitive_words.txt文件里配置敏感词，一行一个敏感词
2. 启动 sensitive_words.js 即可

## 定时群发消息：broadcast.js
1. 在jobs.csv配置定时发送的消息，第一列是发送时间例如9:00，第二列是发送的内容，如果需要发送图片就在内容的任意位置添加image=[图片网络地址]
2. 启动 broadcast.js 即可
