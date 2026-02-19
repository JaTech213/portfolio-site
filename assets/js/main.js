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
