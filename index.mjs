import {WechatyBuilder}  from 'wechaty';
// const { WechatyBuilder } = Wechaty;

import QRCode from 'qrcode-terminal';
// const { QRCode } = terminal;
import {kimi_reply} from "./ai.mjs"


const maxRepeatCount = 3;
let chatObjectHashTable = new Map();
let is_pause = false
const bot = WechatyBuilder.build();

function onScan(qrcode, status) 
{
    if (status === '200') 
    {
        console.log('扫描成功，等待登录...');
    } else 
    {
        QRCode.generate(qrcode, { small: true });
        console.log('微信登录需要扫描二维码:\n' + qrcode);
    }
}

async function onLogin(user) 
{
    console.log(`${user} 登录了`);
    const fileHelper = bot.Contact.load('filehelper'); 
    await fileHelper.say("自动回复机器人启动");
    // let fileHelper = await bot.Contact.find({ name: '文件传输助手' });
    // if (fileHelper) 
    // { 
    //     await fileHelper.say('你好，文件传输助手,机器人已启动');
    // }
}

async function onMessage(msg) 
{
    
    const room = msg.room();
    const talker = await msg.talker();
    if(msg.self)
    {
        
        let command = ''
        let is_command = true
        switch(msg.text())
        {
            case "暂停":
                is_pause = true;
                command = "已暂停"
                console.log(command,is_pause);
                break;
            case "继续":
                command = "已继续"
                is_pause = false;
                console.log(command,is_pause);
                break;
            case "退出":
                bot.stop();
                command = "已退出"
                console.log(command);
                process.exit()
                break;
            default:
                is_command = false
                break;
        }
        if(is_command)
        {
            const fileHelper = bot.Contact.load('filehelper'); 
            await fileHelper.say(command);
        }
    }
    if(is_pause)
        return

    
    
    // const f = msg.from();
    // console.log("你现在是否被艾特：",await msg.mentionSelf());
    //文本为真，不是自己，如果在群上被艾特后才能回答
    if((!room || (room && await msg.mentionSelf())) && msg.text() && !msg.self())
    {
        
    
        console.log("用户",talker.name(),"已发送文本",msg.text());
        let _object = chatObjectHashTable.get(talker.name())
        
        // 当前对象是第一次发消息所以初始化
        if(_object == undefined)
        {
            _object = {count:0,text:msg.text}
        }

        //如果当前值和之前的值一样就+1并判断是否超过阈值
        if(_object.text == msg.text)
        {
           _object.count += 1;
           if(_object.count == maxRepeatCount)
            {
                _object.count = 0;
                chatObjectHashTable.set(talker.name(),_object)

                const fileHelper = bot.Contact.load('filehelper'); 
                await fileHelper.say(talker.name()+"的对话已被拦截");
                return
            }    
        }
        else
        {
            _object.text = msg.text;
        }
        
        chatObjectHashTable.set(talker.name(),_object);



        let text = await kimi_reply("因为我由于某些原因无法跟跟你聊天的人对话，所以你将扮演我跟他(或她)聊天，解答他(或她)提出的问题",msg.text())
        text += "(本人不在，此文本由ai生成,此ai无法联系上下文)"
        console.log("文本内容: ",text);
        msg.say(text);
    }
}    

async function main() {
    
    
    bot.on('scan', onScan);
    bot.on('login', onLogin);
    bot.on('message', onMessage);

    await bot.start();
    console.log('Wechaty 机器人启动成功');
}

main().catch((e)=>
{
    process.exit()
});
// main()