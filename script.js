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
});
