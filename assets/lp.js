mountManga('manga4', { fin: false, imgBase: (window.SITE_ROOT || '') + 'img/' });
// 「マイチャペなら〜」の強調: 画面に入ったとき、ふわっと出て、マーカーが引かれる。スクリプトが動かなくても、最初から全部見える
(function () {
  try {
    var c = document.querySelector('.chape-say'); if (!c) return;
    if (!('IntersectionObserver' in window)) return;
    document.documentElement.className += ' js';
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { c.classList.add('go'); io.disconnect(); } }); }, { threshold: .9, rootMargin: '0px 0px -14% 0px' });
    io.observe(c);
  } catch (e) {}
})();
