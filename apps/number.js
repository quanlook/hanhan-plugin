import plugin from "../../../lib/plugins/plugin.js"
import { recallSendForwardMsg } from "../utils/common.js"
import fetch from "node-fetch"
import { Config } from "../utils/config.js"

export class morse extends plugin {
  constructor() {
    super({
      name: "憨憨数字",
      dsc: "憨憨数字",
      event: "message",
      priority: 6,
      rule: [
        {
          reg: "^#?5670$",
          fnc: "5670"
        },
        {
          reg: "^#?50033$",
          fnc: "50033"
        },
        {
          reg: "^#?(75946|36518)$",
          fnc: "25508"
        },
        {
          reg: "^#?数字类菜单$",
          fnc: "helps"
        }
      ]
    })
  }

  async helps(e) {
    if (e.bot.config?.markdown?.type) { return await this.reply("按钮菜单") }
  }

  async 50033(e) {
    let forwardMsgs = []
    forwardMsgs.push(segment.image("http://165.154.133.106:50033/"))
    if (!e.bot.config?.markdown?.type) { forwardMsgs.push("http://165.154.133.106:50033/") }
    let dec = e.msg
    return this.reply(await recallSendForwardMsg(e, forwardMsgs, false, dec))
  }

  async 25508(e) {
    let url = "http://api.yujn.cn/api/sese.php?"
    if (e.msg.includes("36518")) {
      url = "http://api.yujn.cn/api/r18.php?"
    }
    let res = await fetch(url).catch((err) => logger.error(err))
    if (!res) {
      logger.error("接口请求失败")
      return await this.reply("接口请求失败")
    }
    console.log(res.url)
    let forwardMsgs = []
    forwardMsgs.push(segment.image(res.url))
    if (!e.bot.config?.markdown?.type) { forwardMsgs.push(res.url) }
    let dec = e.msg
    return this.reply(await recallSendForwardMsg(e, forwardMsgs, false, dec))
  }

  async 5670(e) {
    let resp = await fetch("https://api.yujn.cn/api/Pixiv.php?")
    let str = await resp.text()
    let result = str.trim()
    let forwardMsgs = []
    forwardMsgs.push(segment.image(result))
    if (!e.bot.config?.markdown?.type) { forwardMsgs.push(result) }
    let dec = e.msg
    return this.reply(await recallSendForwardMsg(e, forwardMsgs, false, dec))
  }

  async reply(message) {
    return await this.e.reply(message, false, { recallMsg: Config.recall_s })
  }
}
