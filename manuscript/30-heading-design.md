---
title: 見出しのデザインと採番
class: chapter
---

# 見出しのデザインと採番

LaTeX の `titlesec`（`\titleformat`）に相当することを、この環境では CSS で行います。
設定はすべて [themes/headings.css](themes/headings.css) に入っています。

## 章番号が通る仕組み

原稿のフロントマターに `class: chapter` を書きます。これだけで章番号が振られます。

```md
---
title: 章のタイトル
class: chapter
---
```

CSS 側で `counter-reset` や `counter-increment` を書く必要はありません。
theme-base が次の仕掛けを用意しているからです。

```css
html.chapter, body.chapter  { page: chapter-document; }
@page :nth(1)               { counter-increment: var(--vs-page--doc-counter-increment); }
@page chapter-document      { --vs-page--doc-counter-increment:
                                vs-counter-doc vs-counter-chapter; }
```

`@page :nth(1)` は「**各文書の 1 ページ目**」で発火します。VFM は章ごとに別の HTML を
出力するので、章が変わるたびにカウンタが 1 つ進みます。素朴に CSS カウンタを書くと
ファイルごとに 1 に戻ってしまいますが、この仕組みなら通し番号になります。

`class: chapter` を書かなかった原稿は採番の対象外です。前書きや付録のように
番号を振りたくないページは、単に指定しなければ済みます。

## 節と項の番号

節（`h2`）と項（`h3`）は `1.1` `1.1.1` の形にしてあります。

```css
section.level2 { counter-reset: vs-counter-sec-h3; }

body.chapter section.level2 > h2::before {
  content: counter(vs-counter-chapter) '.' counter(vs-counter-sec-h2);
}
body.chapter section.level3 > h3::before {
  content: counter(vs-counter-chapter) '.' counter(vs-counter-sec-h2)
           '.' counter(vs-counter-sec-h3);
}
```

`section.level2` での `counter-reset` を忘れると、項の番号が節をまたいで
通し番号になってしまいます。

### 入れ子の見本

この見出しは `h3` なので、上のルールで番号が振られているはずです。

## デザインを差し替える

`themes/headings.css` に 3 案を入れてあります。既定は A で、B と C は
コメントアウトしてあります。A を閉じて使いたいものを開けば入れ替わります。

| 案 | 見え方 |
| --- | --- |
| A（既定） | 大きな章番号を見出しの上に置き、全体の下に罫線 |
| B | 塗りつぶしたタグを見出しの左脇に置く |
| C | 中央寄せ・字間を広げ、下にヘアライン |

いずれも `::before` の `content` で番号を出しているだけなので、
色・サイズ・配置は普通の CSS として調整できます。アクセント色は
`--heading-accent` にまとめてあります。

## 章を右起こしにする

商業誌のように章を必ず奇数ページから始めたいときは、
`themes/headings.css` の次の指定を有効にします。

```css
:root {
  --vs-section--h1-break-before: recto;
}
```

前の章が奇数ページで終わると、白ページが 1 枚入ります。これは仕様どおりの
挙動で、紙の本ではむしろ正しい組み方です。

## 目次との関係

番号は CSS の `::before` で描いているため、**目次には出ません**。
目次は見出しの文字列だけを拾います。目次にも番号を出したい場合は、
`::before` をやめて原稿の見出しに直接 `第1章 …` と書くか、
`vivliostyle.config.js` の `toc.transformSectionList` で番号を組み立てます。
