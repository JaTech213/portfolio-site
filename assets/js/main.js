(function () {

  /* =========================
     Footer Year
  ========================= */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* =========================
     Copy Email
  ========================= */
  const email = "jatech213@gmail.com";
  const copyBtn = document.getElementById("copyEmail");
  const status = document.getElementById("copyStatus");

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(email);
        if (status) status.textContent = "Copied!";
        setTimeout(() => { if (status) status.textContent = ""; }, 1500);
      } catch {
        if (status) status.textContent = "Copy failed. You can email directly.";
      }
    });
  }

  /* =========================
     Scroll Reveal
  ========================= */
  const revealEls = document.querySelectorAll(".reveal");

  if (revealEls.length) {
    // Fallback: if IntersectionObserver isn't available, just show everything
    if (!("IntersectionObserver" in window)) {
      revealEls.forEach(el => el.classList.add("is-visible"));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      revealEls.forEach((el) => io.observe(el));
    }
  }

  /* =========================
     Respect Reduced Motion
  ========================= */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduceMotion.matches) return;

  /* =========================
     Ambient Snow (Canvas)
  ========================= */
  (function snow() {
    const canvas = document.getElementById("bgSnow");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0, h = 0;

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    const COUNT = Math.min(160, Math.max(70, Math.floor((w * h) / 14000)));

    const flakes = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.5 + Math.random() * 1.8,
      vy: 0.35 + Math.random() * 1,
      vx: -0.2 + Math.random() * 0.4,
      a: 0.05 + Math.random() * 0.15
    }));

    let raf;

    function draw() {
      ctx.clearRect(0, 0, w, h);

      flakes.forEach(f => {
        f.y += f.vy;
        f.x += f.vx + Math.sin(f.y / 100) * 0.15;

        if (f.y > h + 10) { f.y = -10; f.x = Math.random() * w; }
        if (f.x < -10) f.x = w + 10;
        if (f.x > w + 10) f.x = -10;

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${f.a})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    }

    draw();

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else draw();
    });

  })();

  /* =========================
     Terminal Background
  ========================= */
  (function terminal() {
    const host = document.querySelector(".terminal-bg");
    if (!host) return;

    const commands = [
      "aws s3 sync ./site s3://jaredwilson.me --delete",
      "aws cloudfront create-invalidation --paths '/*'",
      "terraform plan -out=tfplan",
      "terraform apply -auto-approve",
      "gh workflow run deploy.yml",
      "dig +short jaredwilson.me",
      "nslookup jaredwilson.me",
      "ping jaredwilson.me",
      "Get-EventLog -LogName Security -Newest 5",
      "git push origin main",
      "az account show",
      "curl -I https://jaredwilson.me"
    ];

    function spawn() {
      const line = document.createElement("div");
      line.className = "term-line";

      const cmd = commands[Math.floor(Math.random() * commands.length)];
      line.innerHTML = `<span class="dim">jared@cloud</span>:~$ ${cmd}`;

      const pad = 40;
      const x = pad + Math.random() * (host.clientWidth - pad * 2);
      const y = pad + Math.random() * (host.clientHeight - pad * 2);

      line.style.left = x + "px";
      line.style.top = y + "px";

      host.appendChild(line);
      setTimeout(() => line.remove(), 6000);
    }

    for (let i = 0; i < 6; i++) {
      setTimeout(spawn, i * 300);
    }

    setInterval(spawn, 900);
  })();

  (() => {
  const canvas = document.getElementById("bgLightning");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });

  const DPR = Math.min(2, window.devicePixelRatio || 1);
  let W = 0, H = 0;

  function resize() {
    W = Math.floor(window.innerWidth);
    H = Math.floor(window.innerHeight);
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  // --- Lightning parameters (tune these) ---
  const SETTINGS = {
    // How often a strike sequence starts (ms)
    minInterval: 120,
    maxInterval: 420,

    // Bolts per "burst"
    minBoltsPerBurst: 1,
    maxBoltsPerBurst: 3,

    // Bolt look
    mainWidth: 2.2,
    glowWidth: 10,
    glowAlpha: 0.14,

    // Branching
    branchChance: 0.35,
    maxBranches: 2,

    // Jitter / jaggedness
    step: 18,          // distance between segments
    jag: 26,           // horizontal displacement range

    // Lifetime (ms)
    minLife: 90,
    maxLife: 220,

    // Optional ambient flash
    ambientFlashChance: 0.55,
    ambientMaxAlpha: 0.10
  };

  // Utility
  const rand = (a, b) => a + Math.random() * (b - a);
  const randi = (a, b) => Math.floor(rand(a, b + 1));

  // Bolt generator: creates a polyline of points from top -> bottom-ish
  function makeBolt(x0, y0, x1, y1, depth = 0) {
    const pts = [];
    const dx = x1 - x0;
    const dy = y1 - y0;
    const dist = Math.hypot(dx, dy);
    const steps = Math.max(6, Math.floor(dist / SETTINGS.step));

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = x0 + dx * t + rand(-SETTINGS.jag, SETTINGS.jag) * (1 - t);
      const y = y0 + dy * t + rand(-6, 6);
      pts.push({ x, y });
    }

    // Optional branches off main line
    const branches = [];
    if (depth < SETTINGS.maxBranches) {
      for (let i = 2; i < pts.length - 2; i++) {
        if (Math.random() < SETTINGS.branchChance * (0.55 + 0.45 * (i / pts.length))) {
          const p = pts[i];
          const bx1 = p.x + rand(-220, 220);
          const by1 = p.y + rand(60, 260);
          branches.push(makeBolt(p.x, p.y, bx1, by1, depth + 1));
          if (branches.length >= 2) break;
        }
      }
    }

    return { pts, branches };
  }

  // Render a bolt with glow + core
  function drawBolt(bolt, alpha) {
    // Glow pass
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    // Blue-ish glow
    ctx.globalAlpha = alpha * SETTINGS.glowAlpha;
    ctx.strokeStyle = "rgba(140, 210, 255, 1)";
    ctx.lineWidth = SETTINGS.glowWidth;

    strokePts(bolt.pts);

    // Core pass (white)
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = "rgba(255, 255, 255, 1)";
    ctx.lineWidth = SETTINGS.mainWidth;

    strokePts(bolt.pts);

    // Branches
    for (const b of bolt.branches) drawBolt(b, alpha * 0.75);

    ctx.restore();
  }

  function strokePts(pts) {
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();
  }

  // Active strikes
  const strikes = [];

  function spawnBurst() {
    const count = randi(SETTINGS.minBoltsPerBurst, SETTINGS.maxBoltsPerBurst);

    for (let i = 0; i < count; i++) {
      const startX = rand(W * 0.05, W * 0.95);
      const startY = rand(-30, H * 0.10);

      // End point somewhere lower (not always bottom: looks more natural)
      const endX = startX + rand(-W * 0.25, W * 0.25);
      const endY = rand(H * 0.55, H * 0.98);

      const bolt = makeBolt(startX, startY, endX, endY);
      const life = rand(SETTINGS.minLife, SETTINGS.maxLife);
      const born = performance.now();

      strikes.push({ bolt, born, life, flickerSeed: Math.random() });
    }
  }

  function scheduleNext() {
    const t = rand(SETTINGS.minInterval, SETTINGS.maxInterval);
    setTimeout(() => {
      spawnBurst();
      scheduleNext();
    }, t);
  }
  scheduleNext();

  function ambientFlash(alpha) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(180, 220, 255, 1)";
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  // Animation loop
  function tick(now) {
    ctx.clearRect(0, 0, W, H);

    // Draw & prune strikes
    for (let i = strikes.length - 1; i >= 0; i--) {
      const s = strikes[i];
      const age = now - s.born;
      const t = age / s.life;

      if (t >= 1) {
        strikes.splice(i, 1);
        continue;
      }

      // Fast rise + quick decay + flicker
      const flicker = 0.65 + 0.35 * Math.sin((now * 0.06) + s.flickerSeed * 10);
      const a = (t < 0.15 ? (t / 0.15) : (1 - t)) * flicker;

      drawBolt(s.bolt, Math.max(0, Math.min(1, a)));
    }

    // Optional ambient flashes when multiple strikes are active
    if (strikes.length && Math.random() < SETTINGS.ambientFlashChance * 0.05) {
      ambientFlash(rand(0.02, SETTINGS.ambientMaxAlpha));
    }

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
  

  /* =========================
     Parallax Drift (Subtle)
  ========================= */
  (function parallax() {
    const layer = document.querySelector(".terminal-bg");
    if (!layer) return;

    let x = 0, y = 0;

    window.addEventListener("mousemove", (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;

      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      x = dx * 6;
      y = dy * 6;

      layer.style.transform = `translate(${x}px, ${y}px)`;
    });

  })();

})();
