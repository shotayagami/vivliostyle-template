// @ts-check
import { defineConfig } from '@vivliostyle/cli';

// 本文に当てるテーマ。扉・奥付は entry の theme がルートを「置き換える」ので、
// これを並べ直したうえで専用 CSS を足す。
const bookTheme = [
  '@vivliostyle/theme-techbook',
  './themes/custom.css',
  './themes/headings.css',
];

// この rel を付けたエントリは目次に出さない（下の transformDocumentList で使う）。
const NO_TOC_REL = ['titlepage', 'colophon'];

const entry = [
  // 表紙。画像は下の cover.src。Markdown は不要で、CLI が表紙 HTML を生成する。
  { rel: 'cover', theme: './themes/cover.css' },

  // 扉
  {
    rel: 'titlepage',
    path: '01-titlepage.md',
    theme: [...bookTheme, './themes/titlepage.css'],
  },

  // 目次（entry の見出しから自動生成）
  { rel: 'contents' },

  // 本文。フロントマターの class: chapter が章番号を進める。
  '10-introduction.md',
  '20-vfm-cheatsheet.md',
  '30-heading-design.md',

  // 奥付
  {
    rel: 'colophon',
    path: '90-colophon.md',
    theme: [...bookTheme, './themes/colophon.css'],
  },

  // 裏表紙。2 つめの rel:'cover' として書く。
  // output を必ず指定すること（省略すると表紙の cover.html と衝突する）。
  // title を省略すると EPUB の目次で書名を名乗ってしまう。
  {
    rel: 'cover',
    imageSrc: 'images/cover-back.svg',
    imageAlt: '裏表紙',
    output: 'backcover.html',
    title: '裏表紙',
    theme: './themes/cover.css',
  },
];

// 目次から外す出力 HTML 名を entry 定義から自動で集める。
// rel:'cover' は CLI 側で元々目次に載らないので対象外でよい。
const hiddenFromToc = new Set(
  entry.flatMap((e) =>
    typeof e === 'string' || !('path' in e) || !e.path
      ? []
      : [e.rel ?? []].flat().some((r) => NO_TOC_REL.includes(r))
        ? [(e.output ?? e.path).replace(/\.(md|markdown)$/i, '.html')]
        : [],
  ),
);

const el = (tagName, properties, children) => ({
  type: 'element',
  tagName,
  properties,
  children,
});

export default defineConfig({
  // ▼ この 3 つはまず自分の本の情報に書き換える
  title: '本のタイトル',
  author: 'あなたの名前',
  language: 'ja',

  // 用紙サイズ: A5 / A4 / B5 / JIS-B5 / letter … もしくは "182mm,257mm" のような実寸
  size: 'A5',

  theme: bookTheme,

  // 原稿の置き場所。
  // entry の `path` と下の `cover.src` は、ここからの相対パスになる。
  // 一方 entry の `theme` と最上位の `theme` / `output` は
  // 「設定ファイルからの相対パス」なので基準が違う点に注意。
  entryContext: 'manuscript',

  entry,

  output: [{ path: './output/book.pdf', format: 'pdf' }],

  // 表紙画像。任意の画像に差し替えてよい（JPG / PNG / WebP / SVG）。
  cover: {
    src: 'images/cover-front.svg',
    name: '表紙: 本のタイトル',
  },

  toc: {
    title: '目次',
    sectionDepth: 2,

    // 目次に載るかどうかは rel ではなく「原稿エントリかどうか」で決まるため、
    // 扉と奥付は放っておくと目次に出てしまう。ここで取り除く。
    // CSS で隠す方法もあるが、それだと EPUB / webpub の目次には残ってしまう。
    transformDocumentList: (nodeList) => (propsList) =>
      el(
        'ol',
        {},
        nodeList
          .map((node, i) => [node, propsList[i]])
          .filter(([node]) => !hiddenFromToc.has(decodeURI(node.href)))
          .flatMap(([{ href, title, sections }, { children, ...rest }]) => {
            // CLI 既定と同じ挙動: h1 が 1 つだけの文書は、
            // 文書レベルの li を作らず見出し側の li を昇格させる。
            if (sections?.length === 1 && sections[0].level === 1) {
              return [children]
                .flat()
                .flatMap((e) =>
                  e.type === 'element' && e.tagName === 'ol' ? e.children : e,
                );
            }
            return el('li', rest, [
              el('a', { href }, [{ type: 'text', value: title }]),
              ...[children].flat(),
            ]);
          }),
      ),
  },

  vfm: {
    // 数式をビルド時に MathML へ変換する。
    // 既定の 'mathjax' は生成 HTML に CDN の MathJax を読み込むため、
    // ビルドのたびにネットワークが必要になり、オフラインだと
    // 数式が LaTeX のまま出力されてしまう。
    mathRenderer: 'mathml',
  },

  // browser は指定しない。
  // CLI のバージョンごとに検証済みの Chrome が既定で選ばれるため、
  // ここで固定すると CLI を上げても古い Chrome を使い続けてしまう。
  // 手元の Chrome を使いたい場合のみ CLI の --executable-browser を使う。
});
