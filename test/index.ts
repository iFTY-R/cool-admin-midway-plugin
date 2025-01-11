import { Plugin } from '../src/index';
import pluginInfo from '../plugin.json';

async function test() {
  try {
    // 实例化插件
    const dingTalk = new Plugin();
    // 初始化插件
    dingTalk.init(pluginInfo);

    // 测试文本消息
    console.log('测试发送文本消息...');
    await dingTalk.sendText(
      '这是一条测试消息\n来自Cool Admin钉钉插件测试',
      ['13800138000'],  // 替换为实际的手机号
      undefined,
      false
    );

    // 测试markdown消息
    console.log('测试发送markdown消息...');
    await dingTalk.sendMarkdown(
      '杭州天气',
      '#### 杭州天气 \n' +
      '> 9度，西北风1级，空气良89，相对温度73% \n\n' +
      '> ![screenshot](https://img.alicdn.com/tfs/TB1NwmBEL9TBuNjy1zbXXXpepXa-2400-1218.png)\n' +
      '> ###### 10点20分发布 [天气](https://www.dingtalk.com) \n'
    );

    // 测试链接消息
    console.log('测试发送链接消息...');
    await dingTalk.sendLink(
      '时代的火车向前开',
      '这个即将发布的新版本，创始人xx称它为红树林。而在此之前，每当面临重大升级，产品经理们都会取一个应景的代号，这一次，为什么是红树林',
      'https://www.dingtalk.com/',
      'https://img.alicdn.com/tfs/TB1NwmBEL9TBuNjy1zbXXXpepXa-2400-1218.png'
    );

    // 测试ActionCard消息
    console.log('测试发送ActionCard消息...');
    await dingTalk.sendActionCardSingle(
      '乔布斯 20 年前想打造一间苹果咖啡厅',
      '![screenshot](https://img.alicdn.com/tfs/TB1NwmBEL9TBuNjy1zbXXXpepXa-2400-1218.png) \n\n' +
      '### 乔布斯 20 年前想打造的苹果咖啡厅 \n' +
      'Apple Store 的设计正从原来满满的科技感走向生活化，而其生活化的走向其实可以追溯到 20 年前苹果一个建立咖啡馆的计划',
      '阅读全文',
      'https://www.dingtalk.com/',
      '1'
    );

    // 测试FeedCard消息
    console.log('测试发送FeedCard消息...');
    await dingTalk.sendFeedCard([
      {
        title: '时代的火车向前开1',
        messageURL: 'https://www.dingtalk.com/',
        picURL: 'https://img.alicdn.com/tfs/TB1NwmBEL9TBuNjy1zbXXXpepXa-2400-1218.png'
      },
      {
        title: '时代的火车向前开2',
        messageURL: 'https://www.dingtalk.com/',
        picURL: 'https://img.alicdn.com/tfs/TB1NwmBEL9TBuNjy1zbXXXpepXa-2400-1218.png'
      }
    ]);

    console.log('所有测试完成！');
  } catch (error) {
    console.error('测试过程中发生错误:', error);
  }
}

test();
