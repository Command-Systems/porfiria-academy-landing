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
    var cards = [
      {
        question: 'Qual é a enzima deficiente na Porfiria Aguda Intermitente (PAI)?',
        answer: 'PBG-desaminase (porfobilinogênio desaminase), também conhecida como hidroximetilbilano sintase.'
      },
      {
        question: 'Qual o principal sintoma abdominal das porfirias agudas?',
        answer: 'Dor abdominal intensa e difusa, frequentemente acompanhada de náuseas, vômitos e constipação.'
      },
      {
        question: 'Quais fatores podem desencadear uma crise aguda de porfiria?',
        answer: 'Medicamentos indutores do CYP450 (barbitúricos, sulfonamidas), jejum prolongado, estresse, infecções, álcool e alterações hormonais.'
      },
      {
        question: 'Qual o tratamento de primeira linha para crise aguda de porfiria?',
        answer: 'Heminato de arginina (NormoSang/Hemina), associado a medidas de suporte como hidratação, controle da dor e suspensão de fatores desencadeantes.'
      }
    ];

    var currentCard = 0;
    var flashcard = document.querySelector('.flashcard');
    var frontP = document.querySelector('.flashcard-front > p');
    var backP = document.querySelector('.flashcard-back > p');
    var frontLabel = document.querySelector('.flashcard-front .flashcard-label');
    var backLabel = document.querySelector('.flashcard-back .flashcard-label');
    var hint = document.querySelector('.flashcard-hint');
    var status = document.querySelector('.flashcard-status');

    if (flashcard && frontP && backP && cards.length) {
      function updateCard(index) {
        var card = cards[index];
        frontP.textContent = card.question;
        backP.textContent = card.answer;
        if (frontLabel) frontLabel.textContent = 'Pergunta ' + (index + 1);
        if (backLabel) backLabel.textContent = 'Resposta ' + (index + 1);
        if (hint) hint.textContent = 'Clique para ver a resposta';
        if (status) status.textContent = 'Card ' + (index + 1) + ' de ' + cards.length + ' — clique para virar';
        flashcard.classList.remove('flipped');
      }

      flashcard.addEventListener('click', function () {
        if (!this.classList.contains('flipped')) {
          this.classList.add('flipped');
          if (hint) hint.textContent = 'Clique para próxima pergunta';
        } else {
          currentCard = (currentCard + 1) % cards.length;
          updateCard(currentCard);
        }
      });

      updateCard(0);
    }
  } catch (e) {
    console.error('Flashcard error:', e);
  }
});

window.addEventListener('load', function () {
  document.body.classList.remove('page-loading');
  document.body.classList.add('page-loaded');
});
