// 縦に読む4コマ漫画(2026-10-21)。絵は、持ち主が Google Flow で作った静止画(img/manga1〜4.jpg。白背景・グレーの線・水色1色・文字なし)。
// 文字(せりふ・効果音)・枠・動きは、HTML で足す。mountManga(要素の id, { fin: 最後のコマ(解決・ボタン)を出すか, imgBase: 画像の場所 })
// 古い、SVG で描いた仮の絵の版は archive_v2/manga_svg_v1.js
window.mountManga = function (rootId, opts) {
  opts = opts || {};
  var root = document.getElementById(rootId);
  if (!root) return;
  var base = opts.imgBase || 'img/';
  var panels = [
    { img: 'manga1.jpg', say: '式場に行く前に、<br class="b-s b-l">費用の<br class="b-m">相場だけでも<br class="b-s">知りたいな…', sfx: 'うーん…', r: -6,
      alt: 'ソファに並んで座るふたりが、一緒にスマホを見ている。頭の上の吹き出しに、円の記号とはてなマーク。' },
    { img: 'manga2.jpg', say: '見学に時間を取られて、<br>ほかの式場まで回れなかった…', sfx: 'くたくた', r: -6,
      alt: '疲れたふたりが立っている。遠くにチャペルが見え、頭の上に時計と汗のしずく。' },
    { img: 'manga3.jpg', say: 'いろんな式場を、一目で比べられたらいいのにな…', sfx: 'うーむ…', r: -5,
      alt: '資料の山の前で、ふたりが紙を見て、はてなマークを浮かべて困っている。' },
    { img: 'manga4.jpg', say: '見積もりより、<br class="b-s">最終的な金額が<br>上がったらどうしよう…!?', sfx: 'ガーン!', r: 7,
      alt: '見積書を見て驚くふたり。上に、円の記号とびっくりマークが光っている。' }
  ];
  var html = '';
  panels.forEach(function (p, i) {
    html += '<section class="panel img" aria-label="' + (i + 1) + ' コマ目">' +
      '<div class="art" tabindex="0" role="button" aria-label="' + p.alt + '(押すと、はねます)">' +
      '<img src="' + base + p.img + '" alt="" width="896" height="1200" loading="eager" decoding="async">' +
      '<span class="sfx" style="--r:' + p.r + 'deg" aria-hidden="true">' + p.sfx + '</span></div>' +
      '<p class="say">' + p.say + '</p></section>';
  });
  if (opts.fin) html += '<section class="panel fin" aria-label="最後のコマ">' +
    '<span class="glass" aria-hidden="true"></span>' +
    '<div class="callout"><p class="ans">マイチャペなら、<br>皆さんのお悩み、<em>解決</em>できます!</p></div>' +
    '<p style="font-weight:700">人数や予算などの条件を入れるだけ。気になる式場の概算の見積もりが、内訳つきで出ます。</p>' +
    '<a class="btn" href="https://apps.apple.com/app/apple-store/id1615359139?pt=124311441&amp;ct=lp&amp;mt=8">アプリをダウンロードする</a>' +
    '<p class="small" style="color:var(--ink)">iPhone アプリ・無料</p></section>';
  if (!root.querySelector('.panel')) root.innerHTML = html; // 公開サイトでは、ビルドが文と絵を HTML に入れてある(検索エンジンが文を読めるように)。ここでは動きだけ足す

  // 押す(タップ)と、絵がはねて、効果音の文字がもう一度出る
  Array.prototype.forEach.call(root.querySelectorAll('.art'), function (a) {
    function bump() { a.classList.remove('bump'); void a.offsetWidth; a.classList.add('bump'); }
    a.addEventListener('click', bump);
    a.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); bump(); } });
  });

  // 順番を守って出す(持ち主 2026-10-21): 前のコマの「下の説明」が出終わってから、次のコマのオノマトペ(と絵)が出る。
  // 下の説明は、そのコマのオノマトペ・絵のあとに、その部分がスクロールで見えたときに出る。すでに通り過ぎた説明は、待たずに出す(次が止まらないように)
  var els = Array.prototype.slice.call(root.querySelectorAll('.panel'));
  var says = els.map(function (p) { return p.querySelector('.say'); });
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { els.forEach(function (e) { e.classList.add('in'); }); says.forEach(function (e) { if (e) e.classList.add('show'); }); return; }
  var armed = els.map(function () { return false; }), sayVis = els.map(function () { return false; }), sayShown = els.map(function () { return false; }), sayDone = els.map(function () { return false; });
  function done(i) { return !says[i] || sayDone[i]; }
  function step() {
    for (var i = 0; i < els.length; i++) {
      var p = els[i], s = says[i];
      if (armed[i] && !p.classList.contains('in') && (i === 0 || done(i - 1))) p.classList.add('in');
      if (s && p.classList.contains('in') && !sayShown[i]) {
        if (sayVis[i]) { s.classList.add('show'); sayShown[i] = true; }
        else if (s.getBoundingClientRect().bottom < 0) { s.classList.add('show', 'skip'); sayShown[i] = true; sayDone[i] = true; }
      }
    }
  }
  says.forEach(function (s, i) { if (s) s.addEventListener('animationend', function () { sayDone[i] = true; step(); }); });
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) armed[els.indexOf(e.target)] = true; }); step(); }, { threshold: .08 });
  els.forEach(function (e) { io.observe(e); });
  var io2 = new IntersectionObserver(function (es) { es.forEach(function (e) { sayVis[says.indexOf(e.target)] = e.isIntersecting; }); step(); }, { threshold: .6, rootMargin: '0px 0px -8% 0px' });
  says.forEach(function (e) { if (e) io2.observe(e); });
  window.addEventListener('scroll', step, { passive: true });
};
