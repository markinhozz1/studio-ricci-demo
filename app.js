(function () {
  "use strict";
  var modal = document.getElementById("modal");
  var openBtn = document.getElementById("whatsapp-demo");
  var closeBtn = document.getElementById("close-modal");
  if (!modal || !openBtn || !closeBtn) return;

  // Tudo o que fica fora do modal (exceto a faixa de demonstração, que não tem
  // elementos focáveis e precisa continuar visível) recebe "inert" enquanto ele está aberto.
  var background = Array.prototype.filter.call(document.body.children, function (el) {
    return el !== modal && !el.classList.contains("demo-banner") && el.tagName !== "SCRIPT";
  });
  var returnFocusTo = null;

  function isOpen() { return modal.classList.contains("open"); }

  function openModal(event) {
    returnFocusTo = (event && event.currentTarget) || document.activeElement || openBtn;
    modal.hidden = false;
    modal.classList.add("open");
    document.body.classList.add("modal-open");
    background.forEach(function (el) { el.inert = true; });
    closeBtn.focus();
  }

  function closeModal() {
    if (!isOpen()) return;
    modal.classList.remove("open");
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    background.forEach(function (el) { el.inert = false; });
    (returnFocusTo || openBtn).focus();
    returnFocusTo = null;
  }

  openBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", function (event) {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", function (event) {
    if (!isOpen()) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
      return;
    }
    if (event.key === "Tab") {
      // Mantém o foco dentro do modal (reforço ao "inert").
      var focusables = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (event.shiftKey && (document.activeElement === first || !modal.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !modal.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    }
  });
})();
