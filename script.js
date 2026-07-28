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

  window.addEventListener('load', function () {
    document.body.classList.add('page-loaded');
  });
})();
