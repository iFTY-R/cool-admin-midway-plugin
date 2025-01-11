import { BasePlugin } from '@cool-midway/plugin-cli';
import axios from 'axios';
import * as crypto from 'crypto';
import {
  DingMessage,
  DingFeedCardLink,
  DingActionCardButton,
  DingAtConfig
} from './types';

/**
 * 钉钉配置
 */
export interface DingTalkConfig {
  /** 机器人的webhook地址 */
  robotWebhook: string;
  /** 机器人的签名密钥 */
  robotSecret: string;
}

/**
 * 钉钉插件
 */
export class CoolPlugin extends BasePlugin {
  /** 钉钉配置 */
  dingConfig: DingTalkConfig;

  /**
   * 插件就绪
   */
  async ready() {
    // 获取配置
    this.dingConfig = this.pluginInfo.config;
  }

  /**
   * 验证配置
   * @private
   */
  private validateConfig() {
    if (!this.dingConfig) {
      throw new Error('请配置钉钉参数');
    }

    if (!this.dingConfig.robotWebhook) {
      throw new Error('请配置钉钉机器人webhook地址');
    }

    if (!this.dingConfig.robotSecret) {
      throw new Error('请配置钉钉机器人签名密钥');
    }

    // 验证webhook格式
    try {
      new URL(this.dingConfig.robotWebhook);
    } catch (error) {
      throw new Error('钉钉机器人webhook地址格式不正确');
    }
  }

  /**
   * 计算签名
   * @param timestamp - 时间戳
   * @returns 签名结果
   * @private
   */
  private sign(timestamp: number): string {
    try {
      const stringToSign = `${timestamp}\n${this.dingConfig.robotSecret}`;
      const hmac = crypto.createHmac('sha256', this.dingConfig.robotSecret);
      hmac.update(stringToSign);
      return encodeURIComponent(hmac.digest('base64'));
    } catch (error) {
      throw new Error('计算签名失败: ' + error.message);
    }
  }

  /**
   * 发送机器人消息
   * @param msg - 消息内容
   * @returns 发送结果
   * @throws 发送失败时抛出错误
   */
  async sendRobotMessage(msg: DingMessage) {
    // 在发送消息时验证配置
    this.validateConfig();

    try {
      const timestamp = Date.now();
      const sign = this.sign(timestamp);
      const webhook = `${this.dingConfig.robotWebhook}&timestamp=${timestamp}&sign=${sign}`;

      const { data } = await axios.post(webhook, msg);

      // 处理钉钉返回的错误
      if (data.errcode !== 0) {
        throw new Error(data.errmsg || '发送消息失败');
      }

      return data;
    } catch (error) {
      if (error.response) {
        // 处理HTTP错误
        throw new Error(`发送消息失败: HTTP ${error.response.status} - ${error.response.data?.errmsg || error.message}`);
      }
      throw error;
    }
  }

  /**
   * 发送文本消息
   * @param content - 文本内容
   * @param atMobiles - 需要@的手机号列表
   * @param atUserIds - 需要@的用户ID列表
   * @param isAtAll - 是否@所有人
   * @returns 发送结果
   */
  async sendText(content: string, atMobiles?: string[], atUserIds?: string[], isAtAll?: boolean) {
    if (!content) {
      throw new Error('消息内容不能为空');
    }

    const at: DingAtConfig = {
      atMobiles,
      atUserIds,
      isAtAll,
    };

    return await this.sendRobotMessage({
      msgtype: 'text',
      text: {
        content,
      },
      at,
    });
  }

  /**
   * 发送markdown消息
   * @param title - 标题
   * @param text - markdown内容
   * @param atMobiles - 需要@的手机号列表
   * @param atUserIds - 需要@的用户ID列表
   * @param isAtAll - 是否@所有人
   * @returns 发送结果
   */
  async sendMarkdown(title: string, text: string, atMobiles?: string[], atUserIds?: string[], isAtAll?: boolean) {
    if (!title || !text) {
      throw new Error('标题和内容不能为空');
    }

    const at: DingAtConfig = {
      atMobiles,
      atUserIds,
      isAtAll,
    };

    return await this.sendRobotMessage({
      msgtype: 'markdown',
      markdown: {
        title,
        text,
      },
      at,
    });
  }

  /**
   * 发送链接消息
   * @param title - 标题
   * @param text - 消息内容
   * @param messageUrl - 点击消息跳转的URL
   * @param picUrl - 图片URL
   * @returns 发送结果
   */
  async sendLink(title: string, text: string, messageUrl: string, picUrl?: string) {
    if (!title || !text || !messageUrl) {
      throw new Error('标题、内容和跳转链接不能为空');
    }

    // 验证URL格式
    try {
      new URL(messageUrl);
      if (picUrl) {
        new URL(picUrl);
      }
    } catch (error) {
      throw new Error('链接格式不正确');
    }

    return await this.sendRobotMessage({
      msgtype: 'link',
      link: {
        title,
        text,
        messageUrl,
        picUrl,
      },
    });
  }

  /**
   * 发送FeedCard消息
   * @param links - FeedCard消息列表
   * @returns 发送结果
   */
  async sendFeedCard(links: DingFeedCardLink[]) {
    if (!links || !links.length) {
      throw new Error('FeedCard消息列表不能为空');
    }

    // 验证每个链接的格式
    for (const link of links) {
      if (!link.title || !link.messageURL || !link.picURL) {
        throw new Error('FeedCard的标题、跳转链接和图片链接不能为空');
      }

      try {
        new URL(link.messageURL);
        new URL(link.picURL);
      } catch (error) {
        throw new Error('FeedCard的链接格式不正确');
      }
    }

    return await this.sendRobotMessage({
      msgtype: 'feedCard',
      feedCard: {
        links,
      },
    });
  }

  /**
   * 发送ActionCard整体跳转消息
   * @param title - 标题
   * @param text - markdown格式的消息内容
   * @param singleTitle - 单个按钮的标题
   * @param singleURL - 点击按钮触发的URL
   * @param btnOrientation - 按钮排列方向(0：按钮竖直排列，1：按钮横向排列)
   * @returns 发送结果
   */
  async sendActionCardSingle(
    title: string,
    text: string,
    singleTitle: string,
    singleURL: string,
    btnOrientation: '0' | '1' = '0'
  ) {
    if (!title || !text || !singleTitle || !singleURL) {
      throw new Error('标题、内容、按钮标题和按钮链接不能为空');
    }

    try {
      new URL(singleURL);
    } catch (error) {
      throw new Error('按钮链接格式不正确');
    }

    return await this.sendRobotMessage({
      msgtype: 'actionCard',
      actionCard: {
        title,
        text,
        singleTitle,
        singleURL,
        btnOrientation,
      },
    });
  }

  /**
   * 发送ActionCard独立跳转消息
   * @param title - 标题
   * @param text - markdown格式的消息内容
   * @param btns - 按钮列表
   * @param btnOrientation - 按钮排列方向(0：按钮竖直排列，1：按钮横向排列)
   * @returns 发送结果
   */
  async sendActionCardMulti(
    title: string,
    text: string,
    btns: DingActionCardButton[],
    btnOrientation: '0' | '1' = '0'
  ) {
    if (!title || !text) {
      throw new Error('标题和内容不能为空');
    }

    if (!btns || !btns.length) {
      throw new Error('按钮列表不能为空');
    }

    // 验证每个按钮的格式
    for (const btn of btns) {
      if (!btn.title || !btn.actionURL) {
        throw new Error('按钮的标题和链接不能为空');
      }

      try {
        new URL(btn.actionURL);
      } catch (error) {
        throw new Error('按钮链接格式不正确');
      }
    }

    return await this.sendRobotMessage({
      msgtype: 'actionCard',
      actionCard: {
        title,
        text,
        btns,
        btnOrientation,
      },
    });
  }
}

// 导出插件实例
export const Plugin = CoolPlugin;
