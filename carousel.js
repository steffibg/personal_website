/* Simple slideshow for every .carousel on the page.
   - Shows one image/video at a time
   - ← / → buttons, click on an image = next, swipe on phones
   - Hides the arrows if a project has only one image/video */

document.querySelectorAll('.carousel').forEach(function (carousel) {
  var slides = Array.prototype.slice.call(carousel.querySelectorAll('.slides > *'));
  var nav = carousel.querySelector('.carousel-nav');
  var counter = carousel.querySelector('.counter');
  var prevBtn = carousel.querySelector('.prev');
  var nextBtn = carousel.querySelector('.next');
  var current = 0;

  if (slides.length === 0) return;

  function show(index) {
    // pause a video when leaving it
    var old = slides[current];
    if (old.tagName === 'VIDEO') old.pause();
    old.hidden = true;

    current = (index + slides.length) % slides.length;
    slides[current].hidden = false;
    if (counter) counter.textContent = (current + 1) + ' / ' + slides.length;
    preloadNext();
  }

  // quietly load the next image in the background,
  // so clicking → feels instant
  function preloadNext() {
    var next = slides[(current + 1) % slides.length];
    if (next.tagName === 'IMG' && !next.dataset.preloaded) {
      new Image().src = next.currentSrc || next.src;
      next.dataset.preloaded = '1';
    }
  }

  slides.forEach(function (slide, i) { slide.hidden = i !== 0; });
  if (counter) counter.textContent = '1 / ' + slides.length;

  if (slides.length < 2) {
    if (nav) nav.hidden = true;
    return;
  }

  preloadNext();

  prevBtn.addEventListener('click', function () { show(current - 1); });
  nextBtn.addEventListener('click', function () { show(current + 1); });

  // click on an image (not a video, it has its own controls) = next
  slides.forEach(function (slide) {
    if (slide.tagName !== 'VIDEO') {
      slide.style.cursor = 'pointer';
      slide.addEventListener('click', function () { show(current + 1); });
    }
  });

  // swipe on touch screens
  var startX = null;
  carousel.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
  }, { passive: true });
  carousel.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 40) show(current + (diff < 0 ? 1 : -1));
    startX = null;
  });
});
