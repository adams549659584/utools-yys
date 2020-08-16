import { getByCoding } from './Helper/HttpHelper';
import { writeFile, existsSync, mkdirSync } from 'fs';
import { resolve as pathResolve } from 'path';
import cheerio = require('cheerio');
import pinyin = require('tiny-pinyin');

const get = async (url: string): Promise<string> => {
  const data = await getByCoding(url, 'gb2312', null, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      Referer: 'http://www.paopaoche.net/sj/108007.html',
    },
    responseType: 'stream',
  });
  return data;
};

const saveFile = (content: string, relativePath: string, fileName: string) => {
  return new Promise((resolve, reject) => {
    const dir = pathResolve(__dirname, relativePath);
    if (!existsSync(dir)) {
      mkdirSync(dir);
    }
    const fullPath = pathResolve(dir, fileName);
    writeFile(fullPath, content, { encoding: 'utf-8' }, err => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

const main = async () => {
  const that = this;
  const ignoreText = new RegExp('神秘妖怪|妖怪位置|悬赏封印|阴阳师|游戏|手游');
  const specialDescMap = new Map();
  // 神秘妖怪
  let html = await get('http://www.paopaoche.net/sj/107989.html');
  let $ = cheerio.load(html, { decodeEntities: false });
  const specialLiList = $('#news-left > div.glxq > div.xq-main > div > ul > li');
  const specialLiArr = Array.from(specialLiList);
  for (const specialLiNode of specialLiArr) {
    const aNode = $(specialLiNode.firstChild);
    const text = aNode.text();
    const link = aNode.attr('href');
    if (!ignoreText.test(text)) {
      html = await get(link);
      $ = cheerio.load(html, { decodeEntities: false });
      const pList = $('#news-left > div.glxq > div.xq-main > p');
      const pArr = Array.from(pList);
      let pNode = pArr.filter(x => $(x).text().includes('答案：'));
      if (!pNode || pNode.length === 0) {
        pNode = pArr.filter(x => $(x).text().includes('妖怪：'));
      }
      if (pNode && pNode.length > 0) {
        const pNodeText = $(pNode).text();
        const name = pNodeText.includes('答案：') ? pNodeText.replace('答案：', '').replace('【', '').replace('】', '') : pNodeText.match(/(?<=【).*?(?=】)/).toString();
        console.log(`${text}：${name}`);
        specialDescMap.set(name, text);
      }
    }
  }
  // 普通妖怪
  html = await get('http://www.paopaoche.net/sj/108007.html');
  $ = cheerio.load(html, { decodeEntities: false });
  const commonLiList = $('#news-left > div.glxq > div.xq-main > div > ul > li');
  const commonLiArr = Array.from(commonLiList);
  const docIndexs = [];
  // 按顺序来，异步并发，会超时
  for (const commonLiNode of commonLiArr) {
    const aNode = $(commonLiNode.firstChild);
    const text = aNode.text();
    const link = aNode.attr('href');
    if (!ignoreText.test(text)) {
      // console.log(`${text}:${link}`);
      html = await get(link);
      $ = cheerio.load(html, { decodeEntities: false });
      const pList = $('#news-left > div.glxq > div.xq-main > p');
      let handleHtml = '';
      let isValidContent = true;
      for (const pNode of Array.from(pList)) {
        const $pNode = $(pNode);
        const content = $pNode.text().replace(/[\r\n]/g, '');
        if (isValidContent && content && !ignoreText.test(content)) {
          handleHtml += `<p>${$pNode.html()}</p>`;
        }
        // if ($pNode.attr('style') === 'text-align:center;') {
        //   isValidContent = !isValidContent;
        //   if (!isValidContent) {
        //     break;
        //   }
        // }
      }
      await saveFile(handleHtml, './assets/doc', `${text}.html`);
      console.log(`${text}.html 生成完毕...`);
      const name = text.substr(1);
      const specialDesc = specialDescMap.has(name) ? specialDescMap.get(name) : '';
      const py = pinyin.isSupported() ? pinyin.convertToPinyin(name + specialDesc, '', true) : '';
      docIndexs.push({
        t: `${text} ${specialDesc}`,
        d: py,
        p: `assets/doc/${text}.html`,
      });
    }
  }

  saveFile(JSON.stringify(docIndexs.filter(x => x)), './assets', 'indexes.json');
  console.log(`全部生成完毕!`);
};
main();
