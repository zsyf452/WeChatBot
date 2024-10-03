import {OpenAI} from "openai"
 
const client = new OpenAI({
    apiKey: "sk-DMMzS0pZ82AuhkuLYTBa1if4M9RGaz9O7tnQrTDcvd1p9bbe",    
    baseURL: "https://api.moonshot.cn/v1",
});
 


export async function kimi_reply(tips,text)
{
    try
    {
        const completion =await client.chat.completions.create({
            model: "moonshot-v1-8k",         
            messages: [{ 
                role: "system", content: tips,
                role: "user", content: text
            }],
            temperature: 0.3
        });
        // console.log(completion.choices[0].message.content);
        return completion.choices[0].message.content
    }
    catch (error) 
    {
        if (error.type === 'rate_limit_reached_error') 
        {
          const cooldownSeconds = parseInt(error.headers['msh-cooldown-seconds'], 10);
          console.log(`超出速率限制，请稍后重试 ${cooldownSeconds} seconds...`);
          await new Promise(resolve => setTimeout(resolve, cooldownSeconds * 1000));
          // 重试逻辑，可能需要限制重试次数以避免无限重试
          return kimi_reply(tips, text); // 递归调用
        } 
        else 
        {
          // 抛出非速率限制错误
          throw error;
        }
      }
    
}


// let t = await kimi_reply("你无需扮演任何角色","你好");
// console.log(t);
