// Animated "recording" band for the home-page hero.
// Four decorative traces flow left → right, like a multimodal recording:
// EEG-like activity, ECG, respiration, and a pair of coupled signals that drift
// in and out of phase (a nod to interpersonal synchrony).
// These are synthetic curves, not real data. Edit the numbers below to change the look.
(() => {
  const canvas = document.querySelector('.hero-signals');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const SPEED = 55;            // pixels per second
  const LINE = 1.6;            // line width in px
  const WHITE = 'rgba(255,255,255,.42)';
  const WARM = 'rgba(242,169,125,.9)';   // rust-ish
  const COOL = 'rgba(140,196,238,.9)';   // blue

  const gauss = (x, m, s) => Math.exp(-((x - m) ** 2) / (2 * s * s));

  // each signal is a function of u = position along the recording (px), returning about -1..1
  const eeg = u => .5 * Math.sin(u * .045) + .3 * Math.sin(u * .11 + 1.3) + .2 * Math.sin(u * .23 + .4) * Math.sin(u * .017);
  const ecg = u => {
    const p = ((u / 210) % 1 + 1) % 1;                       // one heartbeat every 210 px
    return .15 * gauss(p, .25, .04) - .12 * gauss(p, .47, .012) + gauss(p, .5, .01) - .2 * gauss(p, .53, .012) + .25 * gauss(p, .75, .05);
  };
  const resp = u => Math.sin(u * .012);
  const drift = u => Math.PI * (.5 + .5 * Math.sin(u * .0035)); // phase gap between the pair, 0 → π and back
  const pairA = u => Math.sin(u * .05);
  const pairB = u => Math.sin(u * .05 + drift(u));

  // Layout depends on the canvas shape:
  //  - tall (wide screens): rows are spread over the hero, behind the photo
  //  - short (phones): a compact strip along the bottom of the hero
  // y = row centre and amp = half-height, as fractions of the canvas height
  const LAYOUT_TALL = [
    { f: eeg,   y: .20, amp: .075, color: WHITE },
    { f: ecg,   y: .38, amp: .12,  color: WHITE },
    { f: resp,  y: .56, amp: .05,  color: WHITE },
    { f: pairA, y: .76, amp: .07,  color: WARM },
    { f: pairB, y: .76, amp: .07,  color: COOL },
  ];
  const LAYOUT_STRIP = [
    { f: eeg,   y: .13, amp: .10, color: WHITE },
    { f: ecg,   y: .40, amp: .17, color: WHITE },
    { f: resp,  y: .60, amp: .07, color: WHITE },
    { f: pairA, y: .83, amp: .10, color: WARM },
    { f: pairB, y: .83, amp: .10, color: COOL },
  ];
  let traces = LAYOUT_TALL;

  let w = 0, h = 0, raf = 0, running = false;

  function draw(now) {
    const offset = reduceMotion ? 0 : (now / 1000) * SPEED;   // growing offset makes the curves move right
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = LINE;
    ctx.lineJoin = 'round';
    for (const t of traces) {
      ctx.strokeStyle = t.color;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const y = h * t.y - h * t.amp * t.f(x - offset);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }

  function loop(now) {
    draw(now);
    raf = running ? requestAnimationFrame(loop) : 0;
  }
  function start() { if (!running && !reduceMotion) { running = true; raf = requestAnimationFrame(loop); } }
  function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    traces = h > 240 ? LAYOUT_TALL : LAYOUT_STRIP;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(performance.now());
  }

  window.addEventListener('resize', resize);
  // save battery: only animate while the hero is on screen and the tab is visible
  new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop())).observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  resize();
  start();
})();
