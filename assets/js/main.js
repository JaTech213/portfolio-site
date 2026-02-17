(function () {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const email = "jatech213@gmail.com"; // <- change this
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
})();
