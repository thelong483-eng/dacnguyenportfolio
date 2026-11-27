(function () {
  "use strict";
  var D = window.PORTFOLIO;
  if (!D) return;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (id) { return document.getElementById(id); };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  // **chữ** -> <em class="hl">chữ</em>
  function rich(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<em class="hl">$1</em>'); }
  function pad(n) { return String(n).padStart(2, "0"); }
  function get(obj, path) { return path.split(".").reduce(function (o, k) { return o && o[k]; }, obj); }

  var ICON_MUTED = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>';
  var ICON_SOUND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/></svg>';
  var ICON_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a.5.5 0 0 0 .77.42l10.2-6.5a.5.5 0 0 0 0-.84L8.77 5.08A.5.5 0 0 0 8 5.5z"/></svg>';
  // Trình phát YouTube nhúng được trên web thật; bản xem thử trên claude.ai thì mở tab mới.
  var canEmbed = /^https?:$/.test(location.protocol) && !/claude|anthropic/i.test(location.hostname);
  function ytId(url) {
    if (!url) return "";
    var m = String(url).match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : "";
  }
  var CORNERS ='<span class="vf-corner tl"></span><span class="vf-corner tr"></span><span class="vf-corner bl"></span><span class="vf-corner br"></span>';

  /* ---------- Chữ đơn giản ---------- */
  document.querySelectorAll("[data-bind]").forEach(function (el) {
    el.textContent = get(D, el.getAttribute("data-bind")) || "";
  });
  document.title = D.name.first + " " + D.name.last + " — Videographer";

  /* ---------- Hero ---------- */
  $("hero-eyebrow").innerHTML = '<span class="dot"></span>' + esc(D.city) + " // " + D.services.map(esc).join(" · ");
  $("hero-intro").innerHTML = rich(D.hero.intro);
  $("hero-cta").textContent = D.hero.cta;
  var heroMedia = $("hero-media");
  if (D.hero.video) {
    // video/poster có thể là một chuỗi, hoặc { ngang, doc } để chọn theo hướng màn hình
    var pick = function (v, portrait) {
      if (!v || typeof v === "string") return v || "";
      return (portrait ? v.doc : v.ngang) || v.ngang || v.doc || "";
    };
    var heroVid = document.createElement("video");
    heroVid.muted = true; heroVid.loop = true; heroVid.autoplay = true;
    heroVid.setAttribute("muted", ""); heroVid.setAttribute("playsinline", "");
    heroMedia.appendChild(heroVid);
    heroMedia.parentNode.classList.add("has-video");
    var curPortrait = null;
    var setHeroSrc = function () {
      var portrait = window.innerHeight > window.innerWidth;
      if (portrait === curPortrait) return;
      curPortrait = portrait;
      var poster = pick(D.hero.poster, portrait);
      if (poster) heroVid.poster = poster;
      heroVid.src = pick(D.hero.video, portrait);
      var pr = heroVid.play(); if (pr && pr.catch) pr.catch(function () {});
    };
    setHeroSrc();
    window.addEventListener("resize", setHeroSrc);
    if (reduceMotion) heroVid.addEventListener("loadeddata", function () { heroVid.pause(); });
  } else {
    heroMedia.classList.add("placeholder");
  }

  /* ---------- Tuyên ngôn: tách từ để sáng dần khi cuộn ---------- */
  (function () {
    var out = [];
    D.manifesto.split(/(\*\*.+?\*\*)/).forEach(function (part) {
      if (!part) return;
      var acc = /^\*\*.+\*\*$/.test(part);
      part.replace(/\*\*/g, "").split(/\s+/).forEach(function (w) {
        if (w) out.push('<span class="w' + (acc ? " acc" : "") + '">' + esc(w) + "</span>");
      });
    });
    $("manifesto").innerHTML = out.join(" ");
  })();

  /* ---------- Khách hàng ---------- */
  if (!D.clients || !D.clients.length) {
    $("clients").hidden = true;
  } else {
    var one = D.clients.map(function (c) {
      return '<span class="client">' + (c.logo ? '<img src="' + esc(c.logo) + '" alt="' + esc(c.name) + '" style="height:' + (Number(c.h) || 40) + 'px">' : esc(c.name)) + "</span>";
    }).join("");
    // Lặp đủ dài để dải chạy liền mạch, rồi nhân đôi cho vòng lặp -50%.
    var reps = Math.max(2, Math.ceil(12 / D.clients.length));
    var block = new Array(reps + 1).join(one);
    $("marquee-track").innerHTML = block + '<span aria-hidden="true" style="display:contents">' + block + "</span>";
  }

  /* ---------- Dự án ---------- */
  $("work-title").innerHTML = '<span>' + esc(D.work.title[0]) + '</span><span class="accent">' + esc(D.work.title[1]) + "</span>";
  var list = D.work.projects;
  $("projects").innerHTML = list.map(function (p, i) {
    var doc = p.format === "doc";
    var spec = doc ? "9:16 · 1080×1920" : "16:9 · 4K";
    var yt = ytId(p.youtube);
    var media =
      '<div class="frame-empty">' + CORNERS +
        '<span class="fe-title">' + (yt ? esc(p.title) : "Video sắp cập nhật") + "</span>" +
        '<span class="fe-spec">' + spec + "</span></div>";
    if (p.video) {
      media += '<video muted loop playsinline preload="none" data-src="' + esc(p.video) + '"' + (p.poster ? ' poster="' + esc(p.poster) + '"' : "") + "></video>";
    } else if (yt || p.poster) {
      var src = p.poster || "https://i.ytimg.com/vi/" + yt + "/maxresdefault.jpg";
      media += '<img class="thumb" alt="" loading="lazy" src="' + esc(src) + '"' + (yt ? ' data-yt="' + yt + '"' : "") + ">";
    }
    if (yt) {
      media += '<a class="play" href="' + esc(p.youtube) + '" target="_blank" rel="noopener" data-yt="' + yt + '" aria-label="Phát video ' + esc(p.title) + '">' +
        '<span class="play-ring">' + ICON_PLAY + '</span><span class="play-txt">Xem phim</span></a>';
    }
    var info = [p.client, p.year, p.role].filter(Boolean).map(esc).join(" · ");
    var full = p.youtube
      ? '<a class="link-btn" href="' + esc(p.youtube) + '" target="_blank" rel="noopener"><span class="txt">YouTube</span> ↗</a>'
      : "";
    return (
      '<article class="project ' + (doc ? "is-doc" : "is-ngang") + '" aria-label="' + esc(p.title) + '">' +
        '<div class="project-inner">' +
          '<div class="project-meta"><span class="idx">' + pad(i + 1) + " / " + pad(list.length) + '</span><span class="type">' + esc(p.type) + "</span></div>" +
          '<div class="frame">' + media + "</div>" +
          '<div class="project-foot">' +
            '<div><h3 class="project-title">' + esc(p.title) + '</h3><p class="project-info">' + info + "</p></div>" +
            '<div class="project-actions">' +
              (p.video ? '<button type="button" class="icon-btn mute-btn" aria-label="Bật tiếng">' + ICON_MUTED + "</button>" : "") +
              full +
            "</div>" +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }).join("");

  // Ảnh bìa YouTube: thiếu bản maxres thì lùi về hq, lỗi nữa thì ẩn (hiện khung chờ).
  document.querySelectorAll("img.thumb").forEach(function (img) {
    img.addEventListener("error", function () {
      var id = img.getAttribute("data-yt");
      if (id && img.src.indexOf("maxresdefault") > -1) img.src = "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg";
      else img.remove();
    });
  });

  // Bấm "Xem phim": nhúng trình phát ngay trong khung (một video tại một thời điểm).
  var activeFrame = null;
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a.play");
    if (!a || !canEmbed) return;
    e.preventDefault();
    var frame = a.closest(".frame");
    if (activeFrame && activeFrame.el !== frame) {
      activeFrame.el.innerHTML = activeFrame.html;
      activeFrame.el.classList.remove("playing");
    }
    activeFrame = { el: frame, html: frame.innerHTML };
    frame.querySelectorAll("video").forEach(function (v) { v.pause(); });
    frame.classList.add("playing");
    frame.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + a.getAttribute("data-yt") +
      '?autoplay=1&rel=0&playsinline=1" title="' + esc(a.getAttribute("aria-label")) +
      '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
  });

  /* ---------- Giới thiệu ---------- */
  $("about-title").innerHTML = '<span>' + esc(D.about.title[0]) + ' <span class="accent" style="display:inline">' + esc(D.about.title[1]) + "</span></span>";
  $("about-text").innerHTML = rich(D.about.text);
  $("about-stats").innerHTML = D.about.stats.map(function (s) {
    return "<div><dt>" + esc(s.value) + "</dt><dd>" + esc(s.label) + "</dd></div>";
  }).join("");
  $("about-services").innerHTML = D.about.services.map(esc).join('<span class="sep">/</span>');
  var photos = (D.about.photos || (D.about.photo ? [D.about.photo] : [])).filter(Boolean);
  var fullName = D.name.first + " " + D.name.last;
  if (!photos.length) {
    $("about-photo").innerHTML = '<div class="frame-empty">' + CORNERS + '<span class="fe-title">Ảnh chân dung</span><span class="fe-spec">Dọc 4:5</span></div>';
  } else {
    $("about-photo").innerHTML =
      '<div class="slides" id="slides">' + photos.map(function (src, i) {
        return '<img src="' + esc(src) + '" alt="' + esc(fullName) + " đang làm việc, ảnh " + (i + 1) + '"' + (i ? ' loading="lazy"' : "") + ">";
      }).join("") + "</div>" +
      (photos.length > 1
        ? '<div class="slide-bars" aria-hidden="true">' + photos.map(function () { return "<span><i></i></span>"; }).join("") + "</div>" +
          '<div class="slide-ui"><span class="slide-count" id="slide-count">01 / ' + pad(photos.length) + "</span>" +
          '<span class="slide-nav"><button type="button" class="icon-btn" id="slide-prev" aria-label="Ảnh trước">←</button>' +
          '<button type="button" class="icon-btn" id="slide-next" aria-label="Ảnh sau">→</button></span></div>'
        : "");
    if (photos.length > 1) initSlider(photos.length);
  }

  function initSlider(n) {
    var box = $("about-photo"), track = $("slides"), count = $("slide-count");
    var bars = box.querySelectorAll(".slide-bars span");
    var DUR = 4000, cur = 0, timer = null, paused = false;
    function go(i) {
      cur = (i + n) % n;
      track.style.transform = "translateX(" + (-cur * 100) + "%)";
      count.textContent = pad(cur + 1) + " / " + pad(n);
      bars.forEach(function (b, k) {
        b.className = k < cur ? "done" : k === cur ? "now" : "";
        // khởi động lại thanh chạy của ảnh hiện tại
        var i2 = b.firstChild; i2.style.animation = "none"; void i2.offsetWidth; i2.style.animation = "";
      });
      restart();
    }
    function restart() {
      clearTimeout(timer);
      if (!reduceMotion && !paused) timer = setTimeout(function () { go(cur + 1); }, DUR);
    }
    $("slide-prev").addEventListener("click", function () { go(cur - 1); });
    $("slide-next").addEventListener("click", function () { go(cur + 1); });
    box.addEventListener("mouseenter", function () { paused = true; box.classList.add("paused"); clearTimeout(timer); });
    box.addEventListener("mouseleave", function () { paused = false; box.classList.remove("paused"); go(cur); });
    // Vuốt trên điện thoại
    var x0 = null;
    box.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1));
    });
    // Chỉ tự chạy khi đang nhìn thấy
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { if (!box.classList.contains("paused")) { paused = false; go(cur); } }
        else { paused = true; clearTimeout(timer); }
      }).observe(box);
    } else go(0);
  }

  /* ---------- Liên hệ ---------- */
  var C = D.contact;
  $("contact-title").innerHTML = "<span>" + esc(C.title[0]) + '</span><span class="accent">' + esc(C.title[1]) + "</span>";
  var items = [
    { label: "Email", html: '<a href="mailto:' + esc(C.email) + '">' + esc(C.email) + "</a>", copy: C.email },
    { label: C.phoneNote || "Điện thoại", html: '<a href="tel:' + esc(C.phone.replace(/\s+/g, "")) + '">' + esc(C.phone) + "</a>", copy: C.phone }
  ].concat(C.socials.map(function (s) {
    return { label: s.label, html: s.url ? '<a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.handle) + "</a>" : esc(s.handle) };
  })).concat([{ label: "Khu vực", html: esc(D.city) }]);
  $("contact-grid").innerHTML = items.map(function (it) {
    return '<div class="c-item"><span class="c-label">' + esc(it.label) + '</span><span class="c-value">' + it.html +
      (it.copy ? '<button type="button" class="copy-btn" data-copy="' + esc(it.copy) + '">Sao chép</button>' : "") +
      "</span></div>";
  }).join("");
  $("copyright").textContent = "© " + new Date().getFullYear() + " " + D.name.first + " " + D.name.last;

  document.addEventListener("click", function (e) {
    var b = e.target.closest(".copy-btn");
    if (!b) return;
    var text = b.getAttribute("data-copy");
    var done = function () { b.textContent = "Đã chép"; setTimeout(function () { b.textContent = "Sao chép"; }, 1600); };
    try {
      navigator.clipboard.writeText(text).then(done, function () { selectText(b.previousElementSibling); });
    } catch (err) { selectText(b.previousElementSibling); }
  });
  function selectText(el) {
    var r = document.createRange(); r.selectNodeContents(el);
    var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
  }

  /* ---------- Header đổi nền khi cuộn ---------- */
  var header = $("top-bar");
  function onScrollHeader() { header.classList.toggle("scrolled", window.scrollY > 40); }

  /* ---------- Tuyên ngôn sáng dần ---------- */
  var words = Array.prototype.slice.call(document.querySelectorAll("#manifesto .w"));
  var manifestoEl = $("manifesto");
  function onScrollManifesto() {
    if (reduceMotion || !words.length) return;
    var r = manifestoEl.getBoundingClientRect();
    var vh = window.innerHeight;
    // 0 khi đoạn chữ vừa chạm 85% màn hình, 1 khi lên tới 35%
    var p = (vh * 0.85 - r.top) / (vh * 0.5 + r.height * 0.5);
    p = Math.min(1, Math.max(0, p));
    var n = Math.round(p * words.length);
    words.forEach(function (w, i) { w.classList.toggle("on", i < n); });
  }

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { onScrollHeader(); onScrollManifesto(); ticking = false; });
  }, { passive: true });
  onScrollHeader(); onScrollManifesto();

  /* ---------- Timecode chạy 25 khung/giây ---------- */
  var tcEl = $("timecode");
  if (!reduceMotion) {
    var t0 = performance.now();
    setInterval(function () {
      var f = Math.floor((performance.now() - t0) / 40);
      var fr = f % 25, s = Math.floor(f / 25);
      tcEl.textContent = "TC " + pad(Math.floor(s / 3600)) + ":" + pad(Math.floor(s / 60) % 60) + ":" + pad(s % 60) + ":" + pad(fr);
    }, 40);
  }

  /* ---------- Video dự án: tải khi gần tới, chạy khi đang xem ---------- */
  var videos = Array.prototype.slice.call(document.querySelectorAll(".project video"));
  if ("IntersectionObserver" in window && videos.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting && !v.src && v.dataset.src) v.src = v.dataset.src;
        if (en.intersectionRatio >= 0.55) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
        else v.pause();
      });
    }, { threshold: [0, 0.55], rootMargin: "200px 0px" });
    videos.forEach(function (v) { io.observe(v); });
  }

  // Chỉ một video có tiếng tại một thời điểm
  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".mute-btn");
    if (!btn || btn.disabled) return;
    var v = btn.closest(".project").querySelector("video");
    if (!v) return;
    var turnOn = v.muted;
    videos.forEach(function (o) {
      o.muted = true;
      var b = o.closest(".project").querySelector(".mute-btn");
      b.innerHTML = ICON_MUTED; b.setAttribute("aria-label", "Bật tiếng");
    });
    if (turnOn) {
      v.muted = false;
      btn.innerHTML = ICON_SOUND; btn.setAttribute("aria-label", "Tắt tiếng");
      var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
    }
  });
})();
