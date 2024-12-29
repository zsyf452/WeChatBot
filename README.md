## 使用

本项目用的是暗之月面（kimi)，所以如果要使用得去申请kimi的apikey,申请到后写入ai.mjs文件中的apikey中

```js
const client = new OpenAI({
    apiKey: "***",    
    baseURL: "https://api.moonshot.cn/v1",
});
```

替换"***"中的内容为你申请的apikey即可

