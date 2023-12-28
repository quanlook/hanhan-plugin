import lodash from 'lodash'
import { Data } from '../components/index.js'
import HelpTheme from './help/HelpTheme.js'
import runtimeRender from '../common/runtimeRender.js'

export class help extends plugin {
  constructor () {
    super({
      name: '憨憨帮助',
      dsc: '憨憨帮助',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^#?(nav|憨憨帮助)$',
          fnc: 'help'
        },
        {
          reg: '^#?搜一搜帮助$',
          fnc: 'so_help'
        },
        {
          reg: '^#?视频类菜单$',
          fnc: 'video'
        },
        {
          reg: '^#?美女类菜单$',
          fnc: 'girl'
        },
        {
          reg: '^#?语音类菜单$',
          fnc: 'voice'
        },
        {
          reg: '^#?文本类菜单$',
          fnc: 'text'
        },
        {
          reg: '^#?图片类菜单$',
          fnc: 'photo'
        },
        {
          reg: '^#?管理类菜单$',
          fnc: 'set'
        },
        {
          reg: '^#(408|数字类菜单)$',
          fnc: '408'
        }
      ]
    })
  }

  async girl (e) {
    e.reply('hs\nbs\njk\nxz\nxjj\nwaifu\ngirl\nmt\n买家秀')
  }

  async photo (e) {
    e.reply('mc酱\n小c酱\n兽猫酱\n随机AI\n每日英语\n随机柴郡\n一二布布\n可爱猫猫')
  }

  async text (e) {
    e.reply('kfc\n污句子\n随机日记\n舔狗日记\n新春祝福\n网易云热评\n#发癫+昵称\n#油价+省份')
  }

  async set (e) {
    e.reply('#憨憨设置按钮白名单\n#憨憨删除按钮白名单\n#憨憨更新\n#憨憨强制更新')
  }

  async video (e) {
    e.reply('loli 甜妹 玉足\ncos系列 慢摇视频\n抖音变装 快手变装\n双倍快乐 随机裙子\n纯情女高 吊带系列')
  }

  async 408 (e) {
    e.reply('50033\n75946\n36518\n5670')
  }

  async help (e) {
    let custom = {}
    let help = {}
    let { diyCfg, sysCfg } = await Data.importCfg('help')

    // 兼容一下旧字段
    if (lodash.isArray(help.helpCfg)) {
      custom = {
        helpList: help.helpCfg,
        helpCfg: {}
      }
    } else {
      custom = help
    }

    let helpConfig = lodash.defaults(diyCfg.helpCfg || {}, custom.helpCfg, sysCfg.helpCfg)
    let helpList = diyCfg.helpList || custom.helpList || sysCfg.helpList

    let helpGroup = []

    lodash.forEach(helpList, (group) => {
      if (group.auth && group.auth === 'master' && !e.isMaster) {
        return true
      }

      lodash.forEach(group.list, (help) => {
        let icon = help.icon * 1
        if (!icon) {
          help.css = 'display:none'
        } else {
          let x = (icon - 1) % 10
          let y = (icon - x - 1) / 10
          help.css = `background-position:-${x * 50}px -${y * 50}px`
        }
      })

      helpGroup.push(group)
    })
    let themeData = await HelpTheme.getThemeData(diyCfg.helpCfg || {}, sysCfg.helpCfg || {})
    return await runtimeRender(e, 'help/index', {
      helpCfg: helpConfig,
      helpGroup,
      ...themeData,
      element: 'default'
    }, {
      scale: 1.6
    })
  }

  async so_help (e) {
    /** e.msg 用户的命令消息 */
    logger.info('[用户命令]', e.msg)
    await e.runtime.render('hanhan-plugin', '/help/sys.html')
  }
}
