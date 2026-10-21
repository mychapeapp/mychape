// 共通ヘッダーのメニュー(スマホ)。スクリプトが動かなくても、メニューは、そのまま見える
(function () {
  try {
    var b = document.querySelector('.sh-toggle'), n = document.getElementById('sh-nav');
    if (!b || !n) return;
    document.documentElement.classList.add('menu-js');
    b.addEventListener('click', function () {
      var o = n.classList.toggle('open');
      b.setAttribute('aria-expanded', o ? 'true' : 'false');
      b.setAttribute('aria-label', o ? 'メニューを閉じる' : 'メニューを開く');
    });
    n.addEventListener('click', function (e) { if (e.target.tagName === 'A') { n.classList.remove('open'); b.setAttribute('aria-expanded', 'false'); } });
  } catch (e) {}
})();
