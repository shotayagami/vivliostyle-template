---
title: VFM 記法チートシート
---

# VFM 記法チートシート

原稿は **VFM**（Vivliostyle Flavored Markdown）で書きます。
CommonMark と GitHub Flavored Markdown をすべて含んだうえで、組版向けの記法が足されています。
ここでは標準 Markdown との差分だけをまとめます。

## ルビ

波括弧と縦棒で書きます。

```md
{漢字|かんじ}を読む
{HTML|Hypertext Markup Language} の仕様
```

実際の出力：{漢字|かんじ}を読む。{HTML|Hypertext Markup Language} の仕様。

## 脚注

`footnote` クラスの `span` を本文中に置くと、そのページの下部に脚注として組まれます。

```md
CSS 組版という<span class="footnote">CSS でページレイアウトを指定する方式のこと。</span>考え方。
```

実際の出力：CSS 組版という<span class="footnote">CSS でページレイアウトを指定する方式のこと。</span>考え方。

番号は本文に現れた順に自動で振られます。なお、呼び出しがページの最終行に来て
脚注を組む余白が残っていない場合は、脚注本文だけが次のページに送られます。

## コードブロックのキャプション

言語名のうしろにファイル名を書くと、キャプション付きで表示されます。

````md
```js:hello.js
console.log('Hello');
```

```python title=analysis.py
import pandas as pd
```
````

出力：

```js:hello.js
console.log('Hello');
```

## 数式

`$...$` でインライン、`$$...$$` でディスプレイ数式になります。

インライン：$E = mc^2$

$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$

## 画像とキャプション

段落として単独で置いた画像は、`figure` + `figcaption` に変換されます。

```md
![図1: システム構成](diagram.png)
```

## 改ページ

`break-after-page` クラスの空要素を置くと、そこで改ページされます。

```html
<div class="break-after-page"></div>
```

`break-inside-avoid` を使うと、その要素の途中で改ページされるのを防げます。

## フロントマター

各ファイルの先頭に YAML で指定します。`class` はそのページの `body` に付与されるので、
特定のページだけ CSS で狙い撃ちできます。

```md
---
title: 章のタイトル
class: special-page
---
```

## セクション化

見出しに続く内容は自動で `<section>` に包まれます。
包みたくない場合は、見出しの末尾に同じ数の `#` を付けます。

```md
# セクションを作らない見出し #
```

## 生の HTML

そのまま書けます。ブロック内で空行を挟めば、中でも Markdown が有効になります。

```html
<div class="note">

**注意**：ここは Markdown として解釈されます。

</div>
```

---

より詳しい仕様は [VFM のドキュメント](https://vivliostyle.github.io/vfm/#/vfm)を参照してください。
