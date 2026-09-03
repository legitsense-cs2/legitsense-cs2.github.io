(function () {
  'use strict';

  // ============ Reveal on scroll ============
  var revealNodes = document.querySelectorAll(
    ".stats-panel, .section-heading, .feature-card, .about-card, .update-item, .contact-card"
  );
  for (var i = 0; i < revealNodes.length; i++) revealNodes[i].classList.add("reveal");

  if ("IntersectionObserver" in window) {
    var revealIO = new IntersectionObserver(function (entries) {
      for (var k = 0; k < entries.length; k++) {
        if (entries[k].isIntersecting) {
          entries[k].target.classList.add("is-visible");
          revealIO.unobserve(entries[k].target);
        }
      }
    }, { threshold: 0.16, rootMargin: "0px 0px -36px 0px" });

    for (var n = 0; n < revealNodes.length; n++) revealIO.observe(revealNodes[n]);
  } else {
    for (var j = 0; j < revealNodes.length; j++) revealNodes[j].classList.add("is-visible");
  }

  // ============ Cursor glow ============
  var cursorGlow = document.querySelector('.cursor-glow');
  var mouseX = 0, mouseY = 0;
  var glowX = 0, glowY = 0;

  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.15;
    glowY += (mouseY - glowY) * 0.15;
    cursorGlow.style.transform = 'translate(' + glowX + 'px, ' + glowY + 'px)';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  // ============ Parallax ============
  var parallaxElements = document.querySelectorAll('.parallax-element');
  
  window.addEventListener('scroll', function() {
    var scrolled = window.pageYOffset;
    
    for (var i = 0; i < parallaxElements.length; i++) {
      var speed = parallaxElements[i].getAttribute('data-speed') || 0.5;
      var yPos = -(scrolled * speed);
      parallaxElements[i].style.transform = 'translateY(' + yPos + 'px)';
    }
  });

  // ============ Magnetic buttons ============
  var magneticBtns = document.querySelectorAll('.magnetic-btn');

  magneticBtns.forEach(function(btn) {
    btn.addEventListener('mouseenter', function() {
      btn.classList.add('magnetic-active');
    });

    btn.addEventListener('mouseleave', function() {
      btn.classList.remove('magnetic-active');
      btn.style.transform = '';
    });

    btn.addEventListener('mousemove', function(e) {
      if (!btn.classList.contains('magnetic-active')) return;
      
      var rect = btn.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      
      var moveX = x * 0.3;
      var moveY = y * 0.3;
      
      btn.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px) translateY(-2px)';
    });
  });

  // ============ Ripple effect ============
  function createRipple(e) {
    var button = e.currentTarget;
    var ripple = document.createElement('span');
    var rect = button.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height);
    var x = e.clientX - rect.left - size / 2;
    var y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    button.appendChild(ripple);

    setTimeout(function() {
      ripple.remove();
    }, 600);
  }

  var buttons = document.querySelectorAll('.button');
  buttons.forEach(function(btn) {
    btn.addEventListener('click', createRipple);
  });

  // ============ Tilt effect on cards ============
  var tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      
      var rotateX = (y - centerY) / 10;
      var rotateY = (centerX - x) / 10;
      
      card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
    });

    card.addEventListener('mouseleave', function() {
      card.style.transform = '';
    });
  });

  // ============ Floating particles ============
  var canvas = document.querySelector('.particles-canvas');
  var ctx = canvas.getContext('2d');
  var particles = [];
  var particleCount = 50;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function Particle() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 2 + 0.5;
    this.opacity = Math.random() * 0.5 + 0.1;
  }

  Particle.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  };

  Particle.prototype.draw = function() {
    ctx.fillStyle = 'rgba(255, 122, 0, ' + this.opacity + ')';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  };

  for (var i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (var i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
      
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 120) {
          ctx.strokeStyle = 'rgba(255, 122, 0, ' + (0.15 * (1 - distance / 120)) + ')';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(animateParticles);
  }
  
  animateParticles();

  // Disable animations on reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    particles = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
})();