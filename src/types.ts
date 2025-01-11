/**
 * 钉钉消息类型
 */
export type DingMessageType = 'text' | 'markdown' | 'link' | 'feedCard' | 'actionCard';

/**
 * @的配置
 */
export interface DingAtConfig {
  /** @的手机号列表 */
  atMobiles?: string[];
  /** @的用户ID列表 */
  atUserIds?: string[];
  /** 是否@所有人 */
  isAtAll?: boolean;
}

/**
 * 文本消息
 */
export interface DingTextMessage {
  /** 消息类型 */
  msgtype: 'text';
  /** 文本内容 */
  text: {
    /** 消息内容 */
    content: string;
  };
  /** @配置 */
  at?: DingAtConfig;
}

/**
 * Markdown消息
 */
export interface DingMarkdownMessage {
  /** 消息类型 */
  msgtype: 'markdown';
  /** markdown内容 */
  markdown: {
    /** 标题 */
    title: string;
    /** markdown格式的内容 */
    text: string;
  };
  /** @配置 */
  at?: DingAtConfig;
}

/**
 * 链接消息
 */
export interface DingLinkMessage {
  /** 消息类型 */
  msgtype: 'link';
  /** 链接内容 */
  link: {
    /** 标题 */
    title: string;
    /** 消息内容 */
    text: string;
    /** 点击消息跳转的URL */
    messageUrl: string;
    /** 图片URL */
    picUrl?: string;
  };
}

/**
 * FeedCard消息条目
 */
export interface DingFeedCardLink {
  /** 标题 */
  title: string;
  /** 点击消息跳转的URL */
  messageURL: string;
  /** 图片URL */
  picURL: string;
}

/**
 * FeedCard消息
 */
export interface DingFeedCardMessage {
  /** 消息类型 */
  msgtype: 'feedCard';
  /** feedCard内容 */
  feedCard: {
    /** 链接列表 */
    links: DingFeedCardLink[];
  };
}

/**
 * ActionCard按钮
 */
export interface DingActionCardButton {
  /** 按钮标题 */
  title: string;
  /** 点击按钮触发的URL */
  actionURL: string;
}

/**
 * ActionCard整体跳转消息
 */
export interface DingActionCardSingleMessage {
  /** 消息类型 */
  msgtype: 'actionCard';
  /** actionCard内容 */
  actionCard: {
    /** 标题 */
    title: string;
    /** markdown格式的消息内容 */
    text: string;
    /** 单个按钮的标题 */
    singleTitle: string;
    /** 点击按钮触发的URL */
    singleURL: string;
    /** 按钮排列方向(0：按钮竖直排列，1：按钮横向排列) */
    btnOrientation?: '0' | '1';
  };
}

/**
 * ActionCard独立跳转消息
 */
export interface DingActionCardMultiMessage {
  /** 消息类型 */
  msgtype: 'actionCard';
  /** actionCard内容 */
  actionCard: {
    /** 标题 */
    title: string;
    /** markdown格式的消息内容 */
    text: string;
    /** 按钮列表 */
    btns: DingActionCardButton[];
    /** 按钮排列方向(0：按钮竖直排列，1：按钮横向排列) */
    btnOrientation?: '0' | '1';
  };
}

/**
 * 钉钉消息
 */
export type DingMessage =
  | DingTextMessage
  | DingMarkdownMessage
  | DingLinkMessage
  | DingFeedCardMessage
  | DingActionCardSingleMessage
  | DingActionCardMultiMessage; 