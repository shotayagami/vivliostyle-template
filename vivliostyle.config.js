// @ts-check
import { defineConfig } from '@vivliostyle/cli';

export default defineConfig({
  // ▼ この 3 つはまず自分の本の情報に書き換える
  title: '本のタイトル',
  author: 'あなたの名前',
  language: 'ja',

  // 用紙サイズ: A5 / A4 / B5 / JIS-B5 / letter … もしくは "182mm,257mm" のような実寸
  size: 'A5',

  // テーマは配列で重ねられる。後ろのものが優先。
  // （設定ファイルからの相対パス）
  theme: ['@vivliostyle/theme-techbook', './themes/custom.css'],

  // 原稿の置き場所。
  // entry の `path` と下の `cover.src` は、ここからの相対パスになる。
  // 一方 entry の `theme` と最上位の `theme` / `output` は
  // 「設定ファイルからの相対パス」なので基準が違う点に注意。
  entryContext: 'manuscript',

  entry: [
    { rel: 'cover', path: '00-cover.md', output: 'cover.html', theme: './themes/cover.css' },
    { rel: 'contents' }, // 目次を自動生成
    '01-introduction.md',
    '02-vfm-cheatsheet.md',
  ],

  output: [{ path: './output/book.pdf', format: 'pdf' }],

  // 表紙画像。rel:'cover' のエントリで <img role="doc-cover"> に差し込まれる。
  // name は代替テキスト。省略すると英語の "Cover image" が入る。
  cover: {
    src: 'cover.svg',
    name: '表紙: 本のタイトル',
  },

  toc: {
    title: '目次',
    sectionDepth: 2,
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
