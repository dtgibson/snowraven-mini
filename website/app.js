(function(){
  var root=document.documentElement, toggle=document.getElementById('theme-toggle');
  function store(v){try{localStorage.setItem('srm-site-theme',v)}catch(e){}}
  function hasExplicit(){try{var s=localStorage.getItem('srm-site-theme');return s==='light'||s==='dark'}catch(e){return false}}
  if(toggle){toggle.addEventListener('click',function(){var n=root.getAttribute('data-theme')==='dark'?'light':'dark';root.setAttribute('data-theme',n);store(n)})}
  var mq=matchMedia('(prefers-color-scheme: dark)');
  var onScheme=function(e){if(!hasExplicit())root.setAttribute('data-theme',e.matches?'dark':'light')};
  if(mq.addEventListener)mq.addEventListener('change',onScheme);else if(mq.addListener)mq.addListener(onScheme);
  var mb=document.getElementById('menu-toggle'),mn=document.getElementById('mobile-nav');
  if(mb&&mn){var setOpen=function(o){mb.setAttribute('aria-expanded',String(o));if(o){mn.hidden=false;mn.setAttribute('data-open','')}else{mn.removeAttribute('data-open');mn.hidden=true}};
    mb.addEventListener('click',function(){setOpen(mb.getAttribute('aria-expanded')!=='true')});
    mn.addEventListener('click',function(e){if(e.target.tagName==='A')setOpen(false)});}
  var header=document.querySelector('.site-header');
  var onScroll=function(){if(header)header.classList.toggle('scrolled',scrollY>8)};onScroll();addEventListener('scroll',onScroll,{passive:true});
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver'in window){
    var t=document.querySelectorAll('.feature-row,.privacy-points li,.section-head,.install-card');
    t.forEach(function(el){el.classList.add('reveal')});
    var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.08});
    t.forEach(function(el){io.observe(el)});
  }
})();
