# 钉钉消息插件

钉钉消息推送插件，支持通过机器人 webhook 发送各类消息。

### 相关文档

* [钉钉自定义机器人接入文档](https://open.dingtalk.com/document/orgapp/custom-robot-access)

### 标识

调用插件的时候需要用到标识，对应插件 `plugin.json` 中的 `key` 字段

* 标识：dingtalk

### 配置

```json
{
  "robotWebhook": "机器人的webhook地址",
  "robotSecret": "机器人的加签密钥"
}
```

### 方法

下面是插件提供的一些方法：

* sendText - 发送文本消息

```typescript
/**
 * 发送文本消息
 * @param content 文本内容
 * @param atMobiles 需要@的手机号列表
 * @param atUserIds 需要@的用户ID列表
 * @param isAtAll 是否@所有人
 */
async sendText(content: string, atMobiles?: string[], atUserIds?: string[], isAtAll?: boolean)
```

* sendMarkdown - 发送markdown消息

```typescript
/**
 * 发送markdown消息
 * @param title 标题
 * @param text markdown内容
 * @param atMobiles 需要@的手机号列表
 * @param atUserIds 需要@的用户ID列表
 * @param isAtAll 是否@所有人
 */
async sendMarkdown(title: string, text: string, atMobiles?: string[], atUserIds?: string[], isAtAll?: boolean)
```

* sendLink - 发送链接消息

```typescript
/**
 * 发送链接消息
 * @param title 标题
 * @param text 消息内容
 * @param messageUrl 点击消息跳转的URL
 * @param picUrl 图片URL
 */
async sendLink(title: string, text: string, messageUrl: string, picUrl?: string)
```

* sendFeedCard - 发送FeedCard消息

```typescript
/**
 * 发送FeedCard消息
 * @param links FeedCard消息列表
 */
async sendFeedCard(links: Array<{title: string, messageURL: string, picURL: string}>)
```

* sendActionCardSingle - 发送ActionCard整体跳转消息

```typescript
/**
 * 发送ActionCard整体跳转消息
 * @param title 标题
 * @param text markdown格式的消息内容
 * @param singleTitle 单个按钮的标题
 * @param singleURL 点击按钮触发的URL
 * @param btnOrientation 按钮排列方向(0：按钮竖直排列，1：按钮横向排列)
 */
async sendActionCardSingle(
  title: string,
  text: string,
  singleTitle: string,
  singleURL: string,
  btnOrientation: '0' | '1' = '0'
)
```

* sendActionCardMulti - 发送ActionCard独立跳转消息

```typescript
/**
 * 发送ActionCard独立跳转消息
 * @param title 标题
 * @param text markdown格式的消息内容
 * @param btns 按钮列表
 * @param btnOrientation 按钮排列方向(0：按钮竖直排列，1：按钮横向排列)
 */
async sendActionCardMulti(
  title: string,
  text: string,
  btns: Array<{title: string, actionURL: string}>,
  btnOrientation: '0' | '1' = '0'
)
```

### 调用示例

```typescript
@Inject()
pluginService: PluginService;

// 发送文本消息
await this.pluginService.invoke('dingtalk', 'sendText', 
  '这是一条测试消息', 
  ['13800138000'],  // @指定手机号
  ['user123'],      // @指定用户ID
  false             // 是否@所有人
);

// 发送markdown消息
await this.pluginService.invoke('dingtalk', 'sendMarkdown',
  '杭州天气',
  '#### 杭州天气 \n' +
  '> 9度，西北风1级，空气良89，相对温度73% \n\n' +
  '> ![screenshot](https://img.alicdn.com/tfs/TB1NwmBEL9TBuNjy1zbXXXpepXa-2400-1218.png)\n' +
  '> ###### 10点20分发布 [天气](https://www.dingtalk.com) \n'
);

// 发送链接消息
await this.pluginService.invoke('dingtalk', 'sendLink',
  '时代的火车向前开',
  '这个即将发布的新版本，创始人xx称它为红树林。',
  'https://www.dingtalk.com/',
  'https://img.alicdn.com/tfs/TB1NwmBEL9TBuNjy1zbXXXpepXa-2400-1218.png'
);
```

### 注意事项

1. 使用前需要在钉钉群中添加自定义机器人，获取 webhook 地址
2. 如果开启了安全设置中的"加签"功能，需要配置 `robotSecret`
3. 目前支持：文本、markdown、链接、FeedCard、ActionCard 等消息类型
4. 文本和markdown类型支持@功能

### 更新日志

* v1.0.0 (2024-01-11)
  * 初始版本
  * 支持各类型消息发送
  * 支持@功能
  * 支持消息签名
