import { NextApiRequest, NextApiResponse } from 'next';
import reactStringReplace from 'react-string-replace';
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      message: `${req.method} requests are not allowed（許可されていないリクエストです）`,
    });
  }

  try {
    const { blocks } = JSON.parse(req.body);
    let json = JSON.stringify(blocks, null, 0);

    json = json.replace('//', '').replace('[', '').replace(']', '');

    const lines = json.split(',');

    const links: any[] = [];

    lines.map((line) => {
      if (line.includes('https://')) {
        let link: any = reactStringReplace(
          line,
          /(https?:\/\/\S+)/g,
          (match, i) => match
        );
        link = String(link[1]).slice(0, -2).replace('"', '');
        links.push(link);
      }
      if (line.includes('http://')) {
        let link: any = reactStringReplace(
          line,
          /(http?:\/\/\S+)/g,
          (match, i) => match
        );
        link = String(link[1]).slice(0, -2).replace('"', '');
        links.push(link);
      }
    });

    let cardDatas = [];
    const temps = await Promise.all(
      links.map(async (link) => {
        const metas = await fetch(link)
          .then((res) => res.text())
          .then((text) => {
            const metaData = {
              url: link,
              title: '',
              description: '',
              image: '',
            };
            const doms = new JSDOM(text);
            const metas = doms.window.document.getElementsByTagName('meta');
            for (let i = 0; i < metas.length; i++) {
              let pro = metas[i].getAttribute('property');
              if (typeof pro == 'string') {
                if (pro.match('og:title'))
                  metaData.title = metas[i].getAttribute('content');
                if (pro.match('og:description'))
                  metaData.description = metas[i].getAttribute('content');
                if (pro.match('og:image') && metaData.image === '')
                  metaData.image = metas[i].getAttribute('content');
              }
            }
            return metaData;
          })
          .catch((e) => {
            console.log(e);
          });
        return metas;
      })
    );
    cardDatas = temps.filter((temp) => temp !== undefined);

    res.status(200).json({ cardDatas: cardDatas });
  } catch (e) {
    console.log(e);
    res.statusCode = 500;
    res.end();
  }
}
