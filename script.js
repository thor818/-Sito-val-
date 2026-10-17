// ===== Val srl – interazioni =====
(function () {
  const PHONE_WA = '393295954400';
  const EMAIL = 'valcenesi@gmail.com';

  // Menu mobile
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }));

  // Calcolatore m³ → tonnellate
  const mat = document.getElementById('calcMat');
  const vol = document.getElementById('calcVol');
  const out = document.getElementById('calcOut');
  const fmt = n => n.toLocaleString('it-IT', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const calc = () => {
    const t = (parseFloat(vol.value) || 0) * parseFloat(mat.value);
    out.textContent = '≈ ' + fmt(t) + ' t';
  };
  mat.addEventListener('change', calc);
  vol.addEventListener('input', calc);
  calc();

  // Link che preselezionano il materiale nel form
  const cerSelect = document.getElementById('cerSelect');
  document.querySelectorAll('[data-subject]').forEach(el => el.addEventListener('click', () => {
    const opt = [...cerSelect.options].find(o => o.text.startsWith(el.dataset.subject));
    if (opt) cerSelect.value = opt.value;
  }));

  // Form preventivo → WhatsApp o email
  const form = document.getElementById('quoteForm');
  const err = document.getElementById('formError');
  let via = 'whatsapp';
  form.querySelectorAll('button[data-via]').forEach(b => b.addEventListener('click', () => { via = b.dataset.via; }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('[required]').forEach(f => {
      const valid = f.type === 'checkbox' ? f.checked : f.value.trim() !== '';
      f.classList.toggle('is-invalid', !valid);
      if (!valid) ok = false;
    });
    err.hidden = ok;
    if (!ok) return;

    const d = Object.fromEntries(new FormData(form));
    const lines = [
      'Richiesta preventivo – Val srl',
      'Nome: ' + d.nome,
      d.azienda && 'Azienda: ' + d.azienda,
      'Telefono: ' + d.telefono,
      d.email && 'Email: ' + d.email,
      'Materiale: ' + d.cer,
      d.quantita && 'Quantità stimata: ' + d.quantita + ' t',
      d.comune && 'Comune cantiere: ' + d.comune,
      '',
      d.messaggio
    ].filter(l => typeof l === 'string').join('\n');

    if (via === 'email') {
      location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Richiesta preventivo – ' + d.cer) + '&body=' + encodeURIComponent(lines);
    } else {
      window.open('https://wa.me/' + PHONE_WA + '?text=' + encodeURIComponent(lines), '_blank', 'noopener');
    }
  });

  // Lightbox autorizzazioni
  const lb = document.getElementById('lightbox');
  const lbImg = lb.querySelector('img');
  const closeLb = () => { lb.hidden = true; lbImg.src = ''; };
  document.querySelectorAll('#docs button').forEach(b => b.addEventListener('click', () => {
    lbImg.src = b.dataset.full;
    lbImg.alt = b.querySelector('img').alt;
    lb.hidden = false;
  }));
  lb.addEventListener('click', e => { if (e.target !== lbImg) closeLb(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !lb.hidden) closeLb(); });

  // Aperto / chiuso adesso (ora italiana)
  const status = document.getElementById('openStatus');
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Rome' }));
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  const open = day >= 1 && day <= 5 && ((mins >= 480 && mins < 720) || (mins >= 810 && mins < 1050));
  status.textContent = open ? '● Aperto ora' : '● Chiuso ora';
  status.classList.add(open ? 'is-open' : 'is-closed');

  document.getElementById('year').textContent = new Date().getFullYear();

  // Animazioni all'ingresso
  const targets = document.querySelectorAll('.card, .steps li, .cer, .law, .why__item, .split__media, .split__text, .calc, .gallery figure');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
    }), { threshold: .12 });
    targets.forEach(t => { t.classList.add('reveal'); io.observe(t); });
  }
})();
