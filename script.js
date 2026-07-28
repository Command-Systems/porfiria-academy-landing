document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle) {
    toggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
  }

  document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
    });
  });

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var current = 0;
    var increment = Math.max(1, Math.ceil(target / 60));
    var timer = setInterval(function () {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current + '+';
    }, 30);
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var counters = entry.target.querySelectorAll('.stat-number');
        counters.forEach(animateCounter);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  var statsSection = document.querySelector('.stats');
  if (statsSection) {
    observer.observe(statsSection);
  }

  try {
    var flashcards = [
      { q: 'Qual é a enzima deficiente na Porfiria Aguda Intermitente (PAI)?', a: 'PBG-desaminase (porfobilinogênio desaminase), também conhecida como hidroximetilbilano sintase.' },
      { q: 'Qual o principal sintoma abdominal das porfirias agudas?', a: 'Dor abdominal intensa e difusa, frequentemente acompanhada de náuseas, vômitos e constipação.' },
      { q: 'Quais fatores podem desencadear uma crise aguda de porfiria?', a: 'Medicamentos indutores do CYP450 (barbitúricos, sulfonamidas), jejum prolongado, estresse, infecções, álcool e alterações hormonais.' },
      { q: 'Qual o tratamento de primeira linha para crise aguda de porfiria?', a: 'Heminato de arginina (NormoSang/Hemina), associado a medidas de suporte como hidratação, controle da dor e suspensão de fatores desencadeantes.' }
    ];
    var cardIdx = 0;
    var el = document.querySelector('.flashcard');
    var front = el && el.querySelector('.flashcard-front');
    var back = el && el.querySelector('.flashcard-back');
    var hint = el && el.parentNode.querySelector('.flashcard-hint');
    var status = el && el.parentNode.querySelector('.flashcard-status');
    if (el && front && back) {
      var frontP = front.querySelector('p');
      var backP = back.querySelector('p');
      var frontLabel = front.querySelector('.flashcard-label');
      var backLabel = back.querySelector('.flashcard-label');
      function show(n) {
        var c = flashcards[n];
        if (frontP) frontP.textContent = c.q;
        if (backP) backP.textContent = c.a;
        if (frontLabel) frontLabel.textContent = 'Pergunta ' + (n + 1);
        if (backLabel) backLabel.textContent = 'Resposta ' + (n + 1);
        if (hint) hint.textContent = 'Clique para ver a resposta';
        if (status) status.textContent = (n + 1) + '/' + flashcards.length + ' — clique no card';
        el.classList.remove('flipped');
      }
      el.addEventListener('click', function (e) {
        e.stopPropagation();
        if (el.classList.contains('flipped')) {
          cardIdx = (cardIdx + 1) % flashcards.length;
          show(cardIdx);
        } else {
          el.classList.add('flipped');
          if (hint) hint.textContent = 'Clique para próxima';
        }
      });
      show(0);
    }
  } catch (e) { console.error('Flashcard:', e); }
});

window.addEventListener('load', function () {
  document.body.classList.remove('page-loading');
  document.body.classList.add('page-loaded');
});
