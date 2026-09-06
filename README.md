# Vivliostyle 執筆環境テンプレート

Markdown で原稿を書き、CSS 組版で PDF / EPUB / Web 出版物を生成する環境です。
GitHub の **Use this template** から複製して使ってください。

## 複製したら最初にやること

1. `npm install`
2. `vivliostyle.config.js` の `title` と `author` を自分の本の情報に書き換える
3. `manuscript/images/` の表紙・裏表紙画像を自分のものに差し替える
4. `manuscript/01-titlepage.md`（扉）と `manuscript/90-colophon.md`（奥付）を埋める
5. `manuscript/` のサンプル原稿を自分の原稿に差し替え、`entry` を更新する
6. `package.json` の `name` / `description` を変える
7. `npm run preview` で確認しながら書く

サンプルの `10-introduction.md` / `20-vfm-cheatsheet.md` / `30-heading-design.md` は、
この環境の使い方・VFM 記法の早見表・見出しデザインの作り方になっています。
読み終えたら消してかまいません。

## 必要なもの

- Node.js 22.12.0 以上（`@vivliostyle/cli` v11 の要件。動作確認: v22.23.1）

初回ビルド時に、レンダリング用の Chrome が自動でダウンロードされます
（展開後およそ 430MB）。保存先はプロジェクトの外にある共有キャッシュなので、
2 回目以降のビルドや別のプロジェクトでは再ダウンロードされません。

- Windows: `%LOCALAPPDATA%\vivliostyle\browsers\`
- macOS / Linux: `~/.cache/vivliostyle/browsers/`

すでに手元にある Chrome を使いたい場合は `--executable-browser <path>` を指定します。

## セットアップ

```bash
npm install
```

## 使い方

```bash
npm run preview        # ブラウザでプレビュー。保存すると自動で再描画される
npm run build          # output/book.pdf を生成
npm run build:epub     # output/book.epub を生成
npm run build:webpub   # output/webpub/ に Web 公開用の一式を生成
npm run clean          # output/ を削除
npm run clean:all      # output/ と .vivliostyle/（中間ファイル）を削除
```

`npm run build:press` は印刷所入稿用の PDF/X-1a を作りますが、
別途 Ghostscript（または Docker）が必要です。

## ディレクトリ構成

```text
.
├── vivliostyle.config.js     本の設定（書名・用紙サイズ・構成）
├── manuscript/
│   ├── images/
│   │   ├── cover-front.svg   表紙画像（任意の画像に差し替え可）
│   │   └── cover-back.svg    裏表紙画像
│   ├── 01-titlepage.md       扉
│   ├── 10-introduction.md    本文
│   ├── 20-vfm-cheatsheet.md
│   ├── 30-heading-design.md
│   └── 90-colophon.md        奥付
├── themes/
│   ├── custom.css            本文のスタイル調整
│   ├── headings.css          見出しのデザインと採番
│   ├── cover.css             表紙・裏表紙（全面画像）
│   ├── titlepage.css         扉
│   └── colophon.css          奥付
└── output/                   生成物（git 管理外）
```

## 本の構成

`vivliostyle.config.js` の `entry` が本の並び順です。既定では次の順に組まれます。

| 位置 | 中身 | 目次に載るか |
| --- | --- | --- |
| 表紙 | `images/cover-front.svg` | 載らない |
| 扉 | `01-titlepage.md` | 載らない |
| 目次 | 自動生成 | — |
| 本文 | `10-` 〜 `30-` | 載る |
| 奥付 | `90-colophon.md` | 載らない |
| 裏表紙 | `images/cover-back.svg` | 載らない |

### 表紙と裏表紙の差し替え

画像を置き換えるだけです。JPG / PNG / WebP / SVG のどれでもよく、
用紙と縦横比が違っても `object-fit: cover` で紙面いっぱいに敷かれます。

- 表紙 … `cover.src` で指定
- 裏表紙 … 最後の `rel: 'cover'` エントリの `imageSrc` で指定

裏表紙は 2 つめの `rel: 'cover'` エントリとして書いています。`output` の指定は必須で、
省略すると表紙の `cover.html` と出力先が衝突します。

### 扉と奥付が目次に出ない理由

目次に載るかどうかは `rel` ではなく「原稿エントリかどうか」で決まるため、
扉と奥付は放っておくと目次に出ます。`toc.transformDocumentList` で取り除いています。
CSS で隠す方法もありますが、それだと EPUB と webpub の目次には残ってしまいます。

新しく目次に出したくないページを足すときは、エントリに `rel: 'titlepage'` か
`rel: 'colophon'` を付けてください（`NO_TOC_REL` で拾っています）。

## 見出しのデザインと採番

LaTeX の `titlesec` にあたる設定は [themes/headings.css](themes/headings.css) にあります。
章のフロントマターに `class: chapter` を書くと「第1章」「第2章」と番号が通り、
節と項は `1.1` `1.1.1` の形になります。章ごとに別 HTML になるにもかかわらず
番号が続くのは、theme-base が `@page :nth(1)` で文書単位にカウンタを進めているためです。

章扉のデザインは 3 案を用意してあり、既定は A（大きな番号 + 罫線）です。
B（塗りブロックのタグ）と C（中央寄せ + 字間）はコメントアウトしてあるので、
入れ替えて使えます。詳しくは `30-heading-design.md` に書いてあります。

## 章を追加する

1. `manuscript/` に Markdown ファイルを作る
2. `vivliostyle.config.js` の `entry` に**並べたい順に**ファイル名を追加する

```js
  '10-introduction.md',
  '20-vfm-cheatsheet.md',
  '30-heading-design.md',
  '40-new-chapter.md',   // 追加
```

章として番号を振りたい原稿には、フロントマターに `class: chapter` を書きます。

```md
---
title: 新しい章
class: chapter
---
```

目次（`{ rel: 'contents' }`）は `entry` の見出しから自動生成されます。

## 見た目を変える

| やりたいこと | 場所 |
| --- | --- |
| 用紙サイズ | `vivliostyle.config.js` の `size` |
| フォント・行間・余白 | `themes/custom.css` の CSS 変数 |
| 柱（ヘッダー）とノンブル | `themes/custom.css` の `--vs-theme--page-*-content` |
| 見出しのデザイン・章番号 | `themes/headings.css` |
| 表紙・裏表紙 | `manuscript/images/` の画像と `themes/cover.css` |
| 扉 | `manuscript/01-titlepage.md` と `themes/titlepage.css` |
| 奥付 | `manuscript/90-colophon.md` と `themes/colophon.css` |

ベースは [@vivliostyle/theme-techbook](https://github.com/vivliostyle/themes) です。
上書きできる CSS 変数は `node_modules/@vivliostyle/theme-techbook/theme.css` と
`node_modules/@vivliostyle/theme-base/` で確認できます。

## この環境で入れてある調整

素の theme-techbook から次の点を変更してあります。不要なら該当箇所を削除してください。

`themes/custom.css`:

- **目次ページ**: 自動生成される目次は `<h1>書名</h1>` + 目次本体という構造で、
  theme-techbook が目次本体に改ページを掛けるため、書名だけの空ページができます。
  書名は表紙にあるので隠しています。
- **外部リンクの URL 脚注**: theme-base は既定で、PDF 出力時に外部リンクの URL を
  脚注として刷り込みます。リンクが多いと脚注だらけになるためオフにし、
  代わりに下線でリンクだと分かるようにしています。
- **余白と脚注**: A5 に合わせてページ余白を詰め、脚注まわりを少し詰めています。

`vivliostyle.config.js`:

- **`vfm.mathRenderer: 'mathml'`**: 既定の `'mathjax'` は生成 HTML に CDN の
  MathJax を読み込むため、ビルドのたびにネットワークが必要になります。
  MathML ならビルド時に変換されるのでオフラインでも数式が正しく出ます。
- **`browser` を指定していない**: CLI のバージョンごとに検証済みの Chrome が
  既定で選ばれます。ここで固定すると CLI を上げても古い Chrome を使い続けます。

## 参考

- [Vivliostyle ユーザーガイド](https://docs.vivliostyle.org/)
- [VFM（Markdown 記法）](https://vivliostyle.github.io/vfm/#/vfm)
- [公式テーマ集](https://github.com/vivliostyle/themes)
