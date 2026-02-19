(function () {
  // ===== Footer Year =====
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // ===== Copy Email =====
  const email = "jatech213@gmail.com";
  const copyBtn = document.getElementById("copyEmail");
  const status = document.getElementById("copyStatus");

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(email);
        if (status) status.textContent = "Copied!";
        setTimeout(() => {
          if (status) status.textContent = "";
        }, 1500);
      } catch {
        if (status) status.textContent = "Copy failed. You can email directly.";
      }
    });
  }

  // ===== Scroll Reveal Animation =====
  const revealEls = document.querySelectorAll(".reveal");

  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target); // reveal once
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach((el) => io.observe(el));
  }

})();
