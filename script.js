// Small interactive behaviors and entrance animations
function init(){
  // year
  document.getElementById('year').textContent = new Date().getFullYear();

  // mobile nav
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');
  navToggle.addEventListener('click', ()=>{
    navList.classList.toggle('open');
    navToggle.classList.toggle('open');
  });

  // smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',(e)=>{
      const href = a.getAttribute('href');
      if(href.length>1){
        e.preventDefault();
        document.querySelector(href).scrollIntoView({behavior:'smooth',block:'start'});
        if(navList.classList.contains('open')) navList.classList.remove('open');
      }
    })
  });

  // Contact form submission (POST to backend)
  const API_BASE = window.__API_BASE__ || 'http://localhost:3000';
  const contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const name = document.getElementById('cf-name').value.trim();
      const email = document.getElementById('cf-email').value.trim();
      const message = document.getElementById('cf-message').value.trim();
      const statusEl = document.getElementById('cf-status');
      const submitBtn = document.getElementById('cf-submit');
      statusEl.textContent = '';
      submitBtn.disabled = true;
      try{
        const res = await fetch(API_BASE + '/api/contact', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({name,email,message})
        });
        if(res.ok){
          statusEl.style.color = 'var(--accent1)';
          statusEl.textContent = 'Message sent — thank you!';
          contactForm.reset();
        } else {
          const data = await res.json().catch(()=>({}));
          statusEl.style.color = '#f97316';
          statusEl.innerHTML = 'Could not send message — please <a id="cf-mailto" href="#">open email client</a> to send your message.';
          // attach mailto fallback
          const mailtoLink = document.getElementById('cf-mailto');
          if(mailtoLink){
            mailtoLink.addEventListener('click',(ev)=>{
              ev.preventDefault();
              const to = (window.__CONTACT_EMAIL__ || 'shadrackithua74@gmail.com');
              const subject = encodeURIComponent('Portfolio contact from ' + name);
              const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);
              window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
            });
          }
        }
      }catch(err){
        statusEl.style.color = '#f97316';
        statusEl.innerHTML = 'Network error — please <a id="cf-mailto2" href="#">open email client</a> to send your message.';
        const mailtoFallback = document.getElementById('cf-mailto2');
        if(mailtoFallback){
          mailtoFallback.addEventListener('click',(ev)=>{
            ev.preventDefault();
            const to = (window.__CONTACT_EMAIL__ || 'shadrackithua74@gmail.com');
            const subject = encodeURIComponent('Portfolio contact from ' + name);
            const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);
            window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
          });
        }
      } finally { submitBtn.disabled = false }
    });
  }

  // reveal-on-scroll using IntersectionObserver
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    })
  },{threshold:0.12});

  document.querySelectorAll('.about, .hero-left, .contact').forEach(el=>{
    el.classList.add('reveal');
    observer.observe(el);
  });

  // GSAP micro-animations for hero avatar
  if(window.gsap){
    gsap.from('.avatar', {y:20, opacity:0, duration:1.1, ease:'power3.out', delay:0.3});
    gsap.from('.brand', {y:-6, opacity:0, duration:0.8, ease:'power2.out', delay:0.2});
  }

  // Typing + deleting animation for profile role
  (function(){
    const el = document.getElementById('typing');
    if(!el) return;
    const phrases = [
      'Full-Stack Engineer',
      'IT Specialist',
      'Product-minded Developer',
      'Mentor & Team Lead'
    ];
    let pi = 0; // phrase index
    let ci = 0; // char index
    let deleting = false;
    const typeSpeed = 80;
    const deleteSpeed = 40;
    const pauseAfter = 1400;

    function tick(){
      const current = phrases[pi];
      if(!deleting){
        ci++;
        el.textContent = current.slice(0,ci);
        if(ci === current.length){
          deleting = true;
          setTimeout(tick, pauseAfter);
          return;
        }
        setTimeout(tick, typeSpeed + Math.random()*30);
      } else {
        ci--;
        el.textContent = current.slice(0,ci);
        if(ci === 0){
          deleting = false;
          pi = (pi+1) % phrases.length;
          setTimeout(tick, 300);
          return;
        }
        setTimeout(tick, deleteSpeed + Math.random()*20);
      }
    }

    // start slightly after load
    setTimeout(tick, 600);
  })();

  // Typewriter (typing + erasing) for the full About paragraph using JS
  (function(){
    const el = document.getElementById('about-typing');
    const pen = document.getElementById('about-pen');
    if(!el) return;

    const aboutText = `I am a pragmatic Full-Stack Engineer with a proven record of designing and shipping secure, scalable, and user-centered web applications. I’ve partnered with product teams, startups, and enterprise clients to take ideas from early concept to production: scoping requirements, designing robust APIs, implementing reliable data models, and building frontends that prioritize accessibility and clarity. My work focuses on measurable outcomes — faster time-to-market, reduced operational toil, and better user conversion through deliberate engineering and design choices. Technically, I’m comfortable across the stack. On the backend I build resilient services with Node.js and Express, design RESTful and GraphQL APIs, and model data for reliability and performance. I favor pragmatic, well-tested code: unit and integration tests, clear error handling, and observability so issues are detected and resolved quickly in production. On the frontend I deliver component-driven interfaces using React and TypeScript, optimizing for responsiveness, accessibility, and maintainability. I push for patterns that make codebases easier to evolve — typed contracts, small focused components, and consistent styling systems. I also lead the operational side of projects: containerization with Docker, repeatable CI/CD pipelines, infrastructure-as-code where appropriate, and monitoring/alerting to keep systems healthy. Security and privacy are built into designs early — authentication, authorization, secure storage, and sensible rate-limiting are baseline expectations in my implementations. When appropriate I add caching, queueing, and background processing to improve scalability without overengineering. Beyond day-to-day engineering, I care deeply about team effectiveness. I mentor engineers, run design and code reviews, and help teams break large problems into manageable milestones. I write documentation and lightweight guides to reduce onboarding friction and preserve institutional knowledge. Collaboration with designers, product managers, and stakeholders is central to my approach; I translate product goals into pragmatic technical plans and prioritize the work that delivers the most customer value. I contribute to open-source tooling and author short technical write-ups to share learnings with the community. I’m available for contract and remote work and enjoy roles where I can both ship features and influence product and architecture decisions.`;

    let i = 0;
    let deleting = false;
    const typeSpeed = 18; // ms per char
    const deleteSpeed = 10;
    const pauseAfter = 2400; // pause after full text typed
    const pauseBefore = 700; // pause before typing restarts

    function tick(){
      if(!deleting){
        i++;
        el.textContent = aboutText.slice(0,i);
        if(pen) pen.style.opacity = '1';
        if(i >= aboutText.length){
          deleting = true;
          setTimeout(tick, pauseAfter);
          return;
        }
        setTimeout(tick, typeSpeed + Math.random()*6);
      } else {
        i--;
        el.textContent = aboutText.slice(0,i);
        if(i <= 0){
          deleting = false;
          setTimeout(tick, pauseBefore);
          return;
        }
        setTimeout(tick, deleteSpeed + Math.random()*6);
      }
    }

    // start after a short delay
    setTimeout(()=>{ if(!el.textContent) tick(); }, 900);
  })();

  // theme toggle (light / dark)
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  if(saved === 'light' || (!saved && prefersLight)) root.setAttribute('data-theme','light');

  if(themeToggle){
    themeToggle.addEventListener('click', ()=>{
      const current = root.getAttribute('data-theme');
      const next = current === 'light' ? '' : 'light';
      if(next) root.setAttribute('data-theme', next); else root.removeAttribute('data-theme');
      localStorage.setItem('theme', next || 'dark');
    });
  }

  // copy-to-clipboard helper for visible contact items
  document.querySelectorAll('.info-item').forEach(item=>{
    item.addEventListener('click',(e)=>{
      const href = item.getAttribute('href') || '';
      // if it's a mailto or wa.me, copy visible text instead
      const text = item.textContent.trim();
      if(navigator.clipboard){
        navigator.clipboard.writeText(text).then(()=>{
          const original = item.textContent;
          item.textContent = 'Copied ✓';
          setTimeout(()=> item.textContent = original,1400);
        }).catch(()=>{});
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
