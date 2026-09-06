---
title: はじめに
---

# はじめに

Vivliostyle は、**CSS 組版**によって Web の技術だけで書籍を作るための仕組みです。
原稿は Markdown で書き、レイアウトは CSS で指定し、出力は PDF・EPUB・Web という形になります。

## この環境でできること

| コマンド | 内容 |
| --- | --- |
| `npm run preview` | ブラウザでプレビュー（保存すると自動で再描画） |
| `npm run build` | `output/book.pdf` を生成 |
| `npm run build:epub` | `output/book.epub` を生成 |
| `npm run build:webpub` | Web 公開用の一式を生成 |

## 執筆の流れ

1. `manuscript/` に Markdown ファイルを追加する
2. `vivliostyle.config.js` の `entry` にそのファイル名を並べる
3. `npm run preview` で確認しながら書く
4. 仕上がったら `npm run build` で PDF にする

`entry` に書いた**順番がそのまま本の順番**になります。ファイル名の連番は
人間が並びを把握しやすくするためのもので、Vivliostyle 自体は連番を見ていません。

## レイアウトを変えたいとき

見た目の調整は [themes/custom.css](themes/custom.css) に書きます。
theme-techbook が用意している CSS 変数を上書きするのが一番手軽です<span class="footnote">変数の一覧は https://github.com/vivliostyle/themes を参照してください。</span>。

```css:themes/custom.css
:root {
  --vs-font-size: 9.5pt;
  --vs-page--margin-inner: 20mm;
}
```

用紙サイズは `vivliostyle.config.js` の `size` で変えられます。
`A5` や `B5` のようなプリセットのほか、`182mm,257mm` のような実寸も指定できます。
