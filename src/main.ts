import { TemplatePlugin } from '@/types/utools';

const preload: TemplatePlugin = {
  utools_yys_doc: {
    mode: 'doc',
    args: {
      indexes: require('./assets/indexes.json'),
      placeholder: '阴阳师悬赏封印妖怪刷新地点相关资料',
    },
  },
};

window.exports = preload;
