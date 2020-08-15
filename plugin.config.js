/**
 * @type { import ('./src/types/utools').PluginConfig }
 */
const pluginConfig = {
  pluginName: '阴阳师悬赏封印妖怪查询',
  version: 'v1.0.0',
  description: '阴阳师悬赏封印妖怪刷新地点相关资料',
  author: '罗君',
  homepage: 'https://github.com/adams549659584/utools-yys',
  // main: 'index.html',
  preload: 'preload.js',
  logo: 'assets/img/logo.png',
  platform: ['win32'],
  // development: {
  //   main: '',
  //   preload: '',
  //   logo: '',
  //   buildPath: '',
  // },
  // pluginSetting: {
  //   single: true,
  //   height: 0,
  // },
  features: [
    {
      code: 'utools_yys_doc',
      explain: '阴阳师悬赏封印妖怪刷新地点相关资料',
      cmds: ['yys', '阴阳师', '悬赏', '封印', {
        type: 'window',
        label: '阴阳师',
        match: {
          app: ['onmyoji.exe'],
          title: '/阴阳师/'
        }
      }],
    },
  ],
};
export default pluginConfig;
