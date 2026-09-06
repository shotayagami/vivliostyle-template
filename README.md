# Vivliostyle 執筆環境テンプレート

Markdown で原稿を書き、CSS 組版で PDF / EPUB / Web 出版物を生成する環境です。
GitHub の **Use this template** から複製して使ってください。

## 複製したら最初にやること

1. `npm install`
2. `vivliostyle.config.js` の `title` と `author` を自分の本の情報に書き換える
3. `manuscript/cover.svg` の「本のタイトル」「あなたの名前」を書き換える
4. `manuscript/` のサンプル原稿を自分の原稿に差し替え、`entry` を更新する
5. `package.json` の `name` / `description` を変える
6. `npm run preview` で確認しながら書く

サンプルの `01-introduction.md` と `02-vfm-cheatsheet.md` は、この環境の使い方と
VFM 記法の早見表になっています。読み終えたら消してかまいません。

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
├── vivliostyle.config.js   本の設定（書名・用紙サイズ・章の並び）
├── manuscript/             原稿
│   ├── 00-cover.md         表紙
│   ├── 01-introduction.md
│   ├── 02-vfm-cheatsheet.md
│   └── cover.svg           表紙画像
├── themes/
│   ├── custom.css          本文のスタイル調整
│   └── cover.css           表紙ページ専用スタイル
└── output/                 生成物（git 管理外）
```

## 章を追加する

1. `manuscript/` に Markdown ファイルを作る
2. `vivliostyle.config.js` の `entry` に**並べたい順に**ファイル名を追加する

```js
entry: [
  { rel: 'cover', path: '00-cover.md', output: 'cover.html', theme: './themes/cover.css' },
  { rel: 'contents' },
  '01-introduction.md',
  '02-vfm-cheatsheet.md',
  '03-new-chapter.md',   // 追加
],
```

目次（`{ rel: 'contents' }`）は `entry` の見出しから自動生成されます。

## 見た目を変える

| やりたいこと | 場所 |
| --- | --- |
| 用紙サイズ | `vivliostyle.config.js` の `size` |
| フォント・行間・余白 | `themes/custom.css` の CSS 変数 |
| 柱（ヘッダー）とノンブル | `themes/custom.css` の `--vs-theme--page-*-content` |
| 表紙 | `manuscript/cover.svg` と `themes/cover.css` |

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
