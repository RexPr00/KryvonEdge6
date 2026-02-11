(() => {
  const langSwitch = document.querySelector('[data-lang-switch]');
  const langBtn = document.querySelector('[data-lang-btn]');
  if (langSwitch && langBtn) {
    langBtn.addEventListener('click', () => langSwitch.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (!langSwitch.contains(e.target)) langSwitch.classList.remove('open');
    });
  }

  const mobilePanel = document.querySelector('[data-mobile-panel]');
  const mobileOpen = document.querySelector('[data-mobile-open]');
  const mobileClose = document.querySelector('[data-mobile-close]');
  const setMobile = (state) => mobilePanel?.classList.toggle('open', state);
  mobileOpen?.addEventListener('click', () => setMobile(true));
  mobileClose?.addEventListener('click', () => setMobile(false));
  mobilePanel?.addEventListener('click', (e) => {
    if (e.target === mobilePanel || e.target.closest('a')) setMobile(false);
  });

  const privacyModal = document.querySelector('[data-modal]');
  const privacyOpeners = document.querySelectorAll('[data-open-privacy]');
  const privacyClosers = document.querySelectorAll('[data-close-privacy]');
  const setPrivacy = (state) => privacyModal?.classList.toggle('open', state);
  privacyOpeners.forEach((b) => b.addEventListener('click', (e) => {
    e.preventDefault();
    setPrivacy(true);
  }));
  privacyClosers.forEach((b) => b.addEventListener('click', () => setPrivacy(false)));
  privacyModal?.addEventListener('click', (e) => {
    if (e.target === privacyModal) setPrivacy(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      langSwitch?.classList.remove('open');
      setMobile(false);
      setPrivacy(false);
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const fmtCurrency = (n) => `$${Math.round(n).toLocaleString()}`;
  const investment = document.querySelector('#investment');
  const annual = document.querySelector('#annual');
  const years = document.querySelector('#years');
  const outInvestment = document.querySelector('[data-out-investment]');
  const outAnnual = document.querySelector('[data-out-annual]');
  const outYears = document.querySelector('[data-out-years]');
  const outTotal = document.querySelector('[data-out-total]');
  const outProfit = document.querySelector('[data-out-profit]');
  const outGain = document.querySelector('[data-out-gain]');
  const progress = document.querySelector('[data-progress]');

  const updateCalc = () => {
    if (!investment || !annual || !years) return;
    const p = Number(investment.value);
    const r = Number(annual.value) / 100;
    const y = Number(years.value);
    const total = p * ((1 + r) ** y);
    const profit = total - p;
    const gain = (profit / p) * 100;

    if (outInvestment) outInvestment.textContent = fmtCurrency(p);
    if (outAnnual) outAnnual.textContent = `${annual.value}%`;
    if (outYears) outYears.textContent = `${years.value} ${years.value === '1' ? 'year' : 'years'}`;
    if (outTotal) outTotal.textContent = fmtCurrency(total);
    if (outProfit) outProfit.textContent = fmtCurrency(profit);
    if (outGain) outGain.textContent = `${gain.toFixed(1)}%`;
    if (progress) progress.style.width = `${Math.min(gain, 100)}%`;
  };
  [investment, annual, years].forEach((el) => el?.addEventListener('input', updateCalc));
  updateCalc();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.16 });
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count || 0);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 60));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = `${prefix}${current.toLocaleString()}${suffix}`;
      }, 22);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-count]').forEach((el) => countObserver.observe(el));
})();
