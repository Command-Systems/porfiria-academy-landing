(function () {
  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    function toggleMenu() { navLinks.classList.toggle('open'); }
    toggle.addEventListener('click', toggleMenu);
    toggle.addEventListener('touchend', function (e) { e.preventDefault(); toggleMenu(); });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { navLinks.classList.remove('open'); });
    });
  }

  function setupTabs(tabSelector, panelSelector, tabAttribute, panelAttribute) {
    var tabs = document.querySelectorAll(tabSelector);
    var panels = document.querySelectorAll(panelSelector);
    if (!tabs.length || !panels.length) return;

    function setTab(key) {
      tabs.forEach(function (tab) {
        var isActive = tab.getAttribute(tabAttribute) === key;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        tab.setAttribute('tabindex', isActive ? '0' : '-1');
      });
      panels.forEach(function (panel) {
        var isActive = panel.getAttribute(panelAttribute) === key;
        panel.classList.toggle('active', isActive);
        panel.hidden = !isActive;
      });
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () {
        setTab(tab.getAttribute(tabAttribute));
      });
      tab.addEventListener('keydown', function (event) {
        var nextIndex = index;
        if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = tabs.length - 1;
        if (nextIndex !== index) {
          event.preventDefault();
          tabs[nextIndex].focus();
          setTab(tabs[nextIndex].getAttribute(tabAttribute));
        }
      });
    });
  }

  setupTabs('[data-association-tab]', '[data-association-panel]', 'data-association-tab', 'data-association-panel');
  setupTabs('[data-ict-tab]', '[data-ict-panel]', 'data-ict-tab', 'data-ict-panel');

  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-number').forEach(function (el) {
          var target = parseInt(el.getAttribute('data-count'), 10);
          var cur = 0;
          var step = Math.max(1, Math.ceil(target / 60));
          var t = setInterval(function () {
            cur += step;
            if (cur >= target) { cur = target; clearInterval(t); }
            el.textContent = cur + '+';
          }, 30);
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  var stats = document.querySelector('.stats');
  if (stats) obs.observe(stats);

  var cards = [
    { q: 'Qual é a enzima deficiente na Porfiria Aguda Intermitente (PAI)?', a: 'PBG-desaminase (porfobilinogênio desaminase), também conhecida como hidroximetilbilano sintase.' },
    { q: 'Qual o principal sintoma abdominal das porfirias agudas?', a: 'Dor abdominal intensa e difusa, frequentemente acompanhada de náuseas, vômitos e constipação.' },
    { q: 'Quais fatores podem desencadear uma crise aguda de porfiria?', a: 'Medicamentos indutores do CYP450 (barbitúricos, sulfonamidas), jejum prolongado, estresse, infecções, álcool e alterações hormonais.' },
    { q: 'Qual o tratamento de primeira linha para crise aguda de porfiria?', a: 'Heminato de arginina (NormoSang/Hemina), associado a medidas de suporte como hidratação, controle da dor e suspensão de fatores desencadeantes.' }
  ];
  var cardEl = document.querySelector('.flashcard');
  if (cardEl && cards.length) {
    var frontDiv = cardEl.querySelector('.flashcard-front');
    var backDiv = cardEl.querySelector('.flashcard-back');
    var hint = cardEl.parentNode.querySelector('.flashcard-hint');
    var status = cardEl.parentNode.querySelector('.flashcard-status');
    if (frontDiv && backDiv) {
      var frontP = frontDiv.querySelector('p');
      var backP = backDiv.querySelector('p');
      var frontLbl = frontDiv.querySelector('.flashcard-label');
      var backLbl = backDiv.querySelector('.flashcard-label');
      var idx = 0;
      function render(n) {
        var c = cards[n];
        if (frontP) frontP.textContent = c.q;
        if (backP) backP.textContent = c.a;
        if (frontLbl) frontLbl.textContent = 'Pergunta ' + (n + 1);
        if (backLbl) backLbl.textContent = 'Resposta ' + (n + 1);
        if (hint) hint.textContent = 'Clique para ver a resposta';
        if (status) status.textContent = (n + 1) + '/' + cards.length;
        cardEl.classList.remove('flipped');
      }
      function handleCardClick(e) {
        if (cardEl.classList.contains('flipped')) {
          idx = (idx + 1) % cards.length;
          render(idx);
        } else {
          cardEl.classList.add('flipped');
          if (hint) hint.textContent = 'Clique para próxima';
        }
      }
      cardEl.addEventListener('click', handleCardClick);
      cardEl.addEventListener('touchend', function (e) { e.preventDefault(); handleCardClick(e); });
      render(0);
    }
  }

  var PIX_CODE = '00020126360014BR.GOV.BCB.PIX0114632292020001205204000053039865802BR5901N6001C62220518AssociacaoPorfiria6304C15F';
  var copyButtons = document.querySelectorAll('[id^="copyPixBtn"]');
  var qrModal = document.getElementById('qrModal');

  function showToast(message) {
    var toast = document.createElement('div');
    toast.className = 'pix-toast';
    toast.setAttribute('role', 'status');
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(function () { toast.classList.add('is-visible'); }, 10);
    setTimeout(function () {
      toast.classList.remove('is-visible');
      setTimeout(function () { toast.remove(); }, 300);
    }, 2400);
  }

  function copyPix(event) {
    var target = event.currentTarget;
    var originalHTML = target.innerHTML;

    function done() {
      target.innerHTML = originalHTML;
      showToast('Código PIX copiado!');
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(PIX_CODE).then(done).catch(function () { fallbackCopy(); });
    } else {
      fallbackCopy();
    }

    function fallbackCopy() {
      var textarea = document.createElement('textarea');
      textarea.value = PIX_CODE;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try { document.execCommand('copy'); } catch (e) {}
      textarea.remove();
      done();
    }
  }

  copyButtons.forEach(function (btn) {
    btn.addEventListener('click', copyPix);
  });

  function openQrModal() {
    if (!qrModal) return;
    qrModal.classList.add('is-open');
    qrModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var closeBtn = qrModal.querySelector('.qr-modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeQrModal() {
    if (!qrModal) return;
    qrModal.classList.remove('is-open');
    qrModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  var showQrBtn = document.getElementById('showQrBtn');
  if (showQrBtn) showQrBtn.addEventListener('click', openQrModal);

  if (qrModal) {
    qrModal.querySelectorAll('[data-qr-close]').forEach(function (el) {
      el.addEventListener('click', closeQrModal);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && qrModal.classList.contains('is-open')) closeQrModal();
    });
  }

  window.addEventListener('load', function () {
    document.body.classList.add('page-loaded');
  });
})();
