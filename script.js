var menuButton = document.getElementById('menuButton');
var mobileNav = document.getElementById('mobileNav');
if(menuButton && mobileNav){
  menuButton.addEventListener('click', function(){
    mobileNav.classList.toggle('open');
    menuButton.classList.toggle('open');
  });
  mobileNav.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      mobileNav.classList.remove('open');
      menuButton.classList.remove('open');
    });
  });
}

var scrollProgress = document.getElementById('scrollProgress');
if(scrollProgress){
  window.addEventListener('scroll', function(){
    var h = document.documentElement;
    scrollProgress.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
  }, { passive:true });
}

var adjectives = ['stubborn','quiet','loud','curious','unbothered','tender','reckless','gentle','chaotic','warm','sharp','soft'];
var nouns = ['curiosity','confidence','mischief','warmth','rebellion','wonder','nostalgia','hunger','calm','spark','hope','edge'];
var generatorButton = document.getElementById('generatorButton');
var generatorOutput = document.getElementById('generatorOutput');

if(generatorButton){
  generatorButton.addEventListener('click', function(){
    var a = adjectives[Math.floor(Math.random()*adjectives.length)];
    var n = nouns[Math.floor(Math.random()*nouns.length)];
    generatorOutput.innerHTML = 'Your FuzZ is: <b>' + a + ' ' + n + '</b>.';

    generatorOutput.classList.remove('pop');
    void generatorOutput.offsetWidth;
    generatorOutput.classList.add('pop');

    var rect = generatorButton.getBoundingClientRect();
    var cx = rect.left + rect.width/2;
    var cy = rect.top + rect.height/2;
    var burstColors = ['#3E0C17','#8b9420','#D49993'];
    for(var i = 0; i < 12; i++){
      (function(){
        var seed = document.createElement('div');
        var ang = Math.random()*Math.PI*2;
        var dist = 40 + Math.random()*50;
        var w = 5 + Math.random()*3;
        var h = w*1.5;
        seed.style.cssText = 'position:fixed;left:' + cx + 'px;top:' + cy + 'px;' +
          'width:' + w + 'px;height:' + h + 'px;border-radius:50% 50% 50% 50% / 60% 60% 40% 40%;' +
          'background:' + burstColors[Math.floor(Math.random()*burstColors.length)] + ';' +
          'pointer-events:none;z-index:9998;opacity:0.9;transition:transform .7s cubic-bezier(.2,.8,.3,1), opacity .7s ease;';
        document.body.appendChild(seed);
        requestAnimationFrame(function(){
          seed.style.transform = 'translate(' + (Math.cos(ang)*dist) + 'px,' + (Math.sin(ang)*dist + 20) + 'px) rotate(' + (Math.random()*180-90) + 'deg)';
          seed.style.opacity = '0';
        });
        setTimeout(function(){ seed.remove(); }, 750);
      })();
    }
  });
}

var heroShape = document.querySelector('.hero-shape');
if(heroShape){
  var shapeX = 0, shapeY = 0;
  var paintShape = function(){
    var drift = Math.min(window.scrollY, 900) * 0.25;
    heroShape.style.transform = 'rotate(-4deg) translate(' + shapeX + 'px,' + (shapeY + drift) + 'px)';
  };
  window.addEventListener('mousemove', function(e){
    shapeX = (e.clientX / window.innerWidth - 0.5) * 14;
    shapeY = (e.clientY / window.innerHeight - 0.5) * 14;
    paintShape();
  });
  window.addEventListener('scroll', paintShape, { passive:true });
}

var clientStrip = document.querySelector('.client-strip');
var clientTrack = document.getElementById('client-track');
if(clientStrip && clientTrack){
  var clientX = clientStrip.offsetWidth;
  var clientSpeed = 0.5;
  var currentClientSpeed = clientSpeed;
  var hoveringClients = false;
  var hasEntered = false;

  clientStrip.addEventListener('mouseenter', function(){ hoveringClients = true; });
  clientStrip.addEventListener('mouseleave', function(){ hoveringClients = false; });

  (function clientLoop(){
    var loopWidth = clientTrack.scrollWidth / 2;
    var target = hoveringClients ? 0 : clientSpeed;
    currentClientSpeed += (target - currentClientSpeed) * 0.05;
    clientX -= currentClientSpeed;

    if(!hasEntered && clientX <= 0) hasEntered = true;
    if(hasEntered && clientX <= -loopWidth) clientX += loopWidth;

    clientTrack.style.transform = 'translateX(' + clientX + 'px)';
    requestAnimationFrame(clientLoop);
  })();
}

var revealEls = document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){ entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(function(el){ io.observe(el); });
} else {
  revealEls.forEach(function(el){ el.classList.add('in'); });
}

function wrapWordsInto(container, text){
  var words = text.trim().split(/\s+/);
  container.innerHTML = words
    .map(function(w, i){ return '<span class="word" style="transition-delay:' + (i * 60) + 'ms">' + w + '</span>'; })
    .join(' ');
}

function buildPopupContent(el, label){
  var lines = label.split('||');
  el.innerHTML = '';

  var title = document.createElement('div');
  title.className = 'popup-title';
  wrapWordsInto(title, lines[0]);
  el.appendChild(title);

  if(lines.length > 1){
    var list = document.createElement('ul');
    list.className = 'popup-list';
    for(var i = 1; i < lines.length; i++){
      var li = document.createElement('li');
      wrapWordsInto(li, lines[i]);
      list.appendChild(li);
    }
    el.appendChild(list);
  }
}

function playForward(video){
  if(video._reverseRAF){ cancelAnimationFrame(video._reverseRAF); video._reverseRAF = null; }
  video.playbackRate = 1;
  video.currentTime = 0;
  var p = video.play();
  if(p && p.catch) p.catch(function(){});
}

function playReverse(video){
  video.pause();
  if(video._reverseRAF) cancelAnimationFrame(video._reverseRAF);

  var speed = 2;
  var lastTime = performance.now();

  function step(now){
    var dt = (now - lastTime) / 1000;
    lastTime = now;
    video.currentTime = Math.max(0, video.currentTime - dt * speed);

    if(video.currentTime > 0.02){
      video._reverseRAF = requestAnimationFrame(step);
    } else {
      video.currentTime = 0;
      video._reverseRAF = null;
    }
  }
  video._reverseRAF = requestAnimationFrame(step);
}

var layerTabs = document.querySelectorAll('.layer-tab');
var peachWrap = document.querySelector('.peach-wrap');

function highlightPeachZone(popupId){
  document.querySelectorAll('.peach-zone').forEach(function(z){
    z.classList.toggle('active-zone', z.dataset.popup === popupId);
  });
}

function setActiveTab(key){
  layerTabs.forEach(function(t){ t.classList.toggle('active', t.dataset.layer === key); });
}

function showPeachPopup(popupId){
  var popup = document.getElementById(popupId);
  var zone = document.querySelector('.peach-zone[data-popup="' + popupId + '"]');
  if(!popup || !zone) return;

  var textEl = popup.querySelector('.popup-text');
  var videoEl = popup.querySelector('.peach-arrow');

  if(textEl) buildPopupContent(textEl, zone.dataset.label);
  if(videoEl) playForward(videoEl);

  document.querySelectorAll('.peach-popup').forEach(function(p){
    if(p !== popup) p.classList.remove('active');
  });
  popup.classList.remove('active');
  void popup.offsetWidth;
  popup.classList.add('active');

  highlightPeachZone(popupId);
  setActiveTab(popupId.replace('popup-', ''));
  if(peachWrap) peachWrap.classList.add('opened');
}

function hidePeachPopup(popupId){
  var popup = document.getElementById(popupId);
  if(!popup) return;
  var videoEl = popup.querySelector('.peach-arrow');
  if(videoEl) playReverse(videoEl);
  popup.classList.remove('active');
}

document.querySelectorAll('.peach-zone').forEach(function(zone){
  zone.addEventListener('mouseenter', function(){ showPeachPopup(zone.dataset.popup); });
  zone.addEventListener('mouseleave', function(){ hidePeachPopup(zone.dataset.popup); });
});

layerTabs.forEach(function(t){
  t.addEventListener('click', function(){ showPeachPopup('popup-' + t.dataset.layer); });
});

var scrollText = 'Art earns Attention. Story earns Connection. Intention gives it meaning. Growth gives it momentum. Victory is what happens when all 4 move together.';

var scrollTrack = document.getElementById('scroll1');
if(scrollTrack){
  var piece = scrollText + '<img class="scroll-separator" src="assets/Logo2.png" alt="">';
  scrollTrack.innerHTML = piece + piece + piece + piece;

  if(scrollTrack.getAnimations){
    var lastY = window.scrollY, velocity = 0, rate = 1;
    window.addEventListener('scroll', function(){
      var y = window.scrollY;
      velocity = Math.min(Math.abs(y - lastY), 50);
      lastY = y;
    }, { passive:true });

    (function tick(){
      velocity *= 0.9;
      var next = velocity < 0.05 ? 1 : 1 + velocity * 0.08;
      if(Math.abs(next - rate) > 0.005){
        rate = next;
        scrollTrack.getAnimations().forEach(function(anim){ anim.playbackRate = rate; });
      }
      requestAnimationFrame(tick);
    })();
  }
}

document.querySelectorAll('.stagger').forEach(function(group){
  Array.prototype.forEach.call(group.children, function(child, i){
    child.style.setProperty('--i', i);
  });

  if('IntersectionObserver' in window){
    var staggerIO = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ entry.target.classList.add('in'); staggerIO.unobserve(entry.target); }
      });
    }, { threshold: 0.15 });
    staggerIO.observe(group);
  } else {
    group.classList.add('in');
  }
});

var RESPECT_REDUCED_MOTION = false;
var reduced = RESPECT_REDUCED_MOTION && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(reduced){ document.documentElement.classList.add('reduce-motion'); }

function startHero(){ document.body.classList.add('ready'); }

var loader = document.getElementById('loader');
if(loader && !reduced){
  setTimeout(startHero, 1300);
  setTimeout(function(){ loader.classList.add('done'); }, 1500);
  setTimeout(function(){ loader.style.display = 'none'; }, 2200);
} else {
  if(loader) loader.style.display = 'none';
  startHero();
}

var lenis = null;
if(!reduced && window.Lenis){
  lenis = new Lenis({
    lerp: 0.08,
    wheelMultiplier: 0.9,
    autoRaf: true
  });
}

var scrollRaf = null;
function easeInOutCubic(t){ return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2; }
function stopScroll(){ if(scrollRaf){ cancelAnimationFrame(scrollRaf); scrollRaf = null; } }
function scrollDuration(dist){ return Math.min(1800, Math.max(900, Math.abs(dist) * 0.7)); }
console.log('%c\uD83C\uDF51 ' + atob('bWFkZSBieSBzYXQ='), 'color:#8b9420;font-size:12px;');

function smoothScrollTo(targetY){
  if(lenis){
    lenis.scrollTo(targetY, {
      duration: scrollDuration(targetY - window.scrollY) / 1000,
      easing: easeInOutCubic
    });
    return;
  }
  stopScroll();
  var max = document.documentElement.scrollHeight - window.innerHeight;
  targetY = Math.max(0, Math.min(targetY, max));
  var startY = window.scrollY;
  var dist = targetY - startY;
  if(reduced || Math.abs(dist) < 2){ window.scrollTo(0, targetY); return; }
  var duration = scrollDuration(dist);
  var t0 = null;
  function step(now){
    if(t0 === null) t0 = now;
    var p = Math.min((now - t0) / duration, 1);
    window.scrollTo(0, startY + dist * easeInOutCubic(p));
    scrollRaf = p < 1 ? requestAnimationFrame(step) : null;
  }
  scrollRaf = requestAnimationFrame(step);
}

['wheel','touchstart','keydown'].forEach(function(evt){
  window.addEventListener(evt, stopScroll, { passive:true });
});

document.querySelectorAll('a[href^="#"]').forEach(function(a){
  a.addEventListener('click', function(e){
    var id = a.getAttribute('href');
    if(id.length < 2) return;
    var target = document.querySelector(id);
    if(!target) return;
    e.preventDefault();
    var navH = document.querySelector('.site-nav').offsetHeight;
    var y = id === '#top' ? 0 : target.getBoundingClientRect().top + window.scrollY - navH;
    smoothScrollTo(y);
  });
});

var scrollTopButton = document.getElementById('scrollTopButton');
if(scrollTopButton){
  window.addEventListener('scroll', function(){
    scrollTopButton.classList.toggle('show', window.scrollY > 600);
  }, { passive:true });
  scrollTopButton.addEventListener('click', function(){ smoothScrollTo(0); });
}

document.addEventListener('click', function(e){
  var colors = ['#3E0C17', '#8b9420', '#D49993'];
  var count = 12;
  var dist = 46;

  for(var i = 0; i < count; i++){
    (function(i){
      var ang = (i / count) * Math.PI * 2;
      var rot = ang * 180 / Math.PI + 90;
      var w = 6;
      var h = 9;
      var seed = document.createElement('div');

      seed.style.cssText = 'position:fixed;left:' + e.clientX + 'px;top:' + e.clientY + 'px;' +
        'width:' + w + 'px;height:' + h + 'px;border-radius:50% 50% 50% 50% / 60% 60% 40% 40%;' +
        'background:' + colors[i % colors.length] + ';' +
        'pointer-events:none;z-index:9998;opacity:0.9;' +
        'transform:translate(-50%,-50%) rotate(' + rot + 'deg);' +
        'transition:transform .6s cubic-bezier(.2,.8,.3,1), opacity .6s ease;';

      document.body.appendChild(seed);

      requestAnimationFrame(function(){
        seed.style.transform = 'translate(' + (Math.cos(ang) * dist) + 'px,' + (Math.sin(ang) * dist) + 'px) translate(-50%,-50%) rotate(' + rot + 'deg)';
        seed.style.opacity = '0';
      });

      setTimeout(function(){ seed.remove(); }, 650);
    })(i);
  }
});