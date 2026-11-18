document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('enquiry');
  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const interest = form.elements.namedItem('interest');

  if (params.has('plan')) interest.value = 'Membership information';
  else if (params.has('interest')) interest.value = 'Class timetable';

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const digits = phone.replace(/\D/g, '');
    const selectedInterest = String(data.get('interest') || '');
    const message = String(data.get('message') || '').trim();
    const status = document.getElementById('status');
    const fallback = document.getElementById('whatsapp-fallback');

    status.textContent = '';
    fallback.hidden = true;

    if (name.length < 2) {
      status.textContent = 'Please enter your name (at least 2 characters).';
      form.elements.namedItem('name').focus();
      return;
    }

    // Accept a 10-digit Indian mobile number, optionally prefixed with +91.
    const validIndianPhone = digits.length === 10 || (digits.length === 12 && digits.startsWith('91'));
    if (!validIndianPhone) {
      status.textContent = 'Please enter a valid 10-digit Indian mobile number.';
      form.elements.namedItem('phone').focus();
      return;
    }

    if (!selectedInterest) {
      status.textContent = 'Please select what you would like to know about.';
      interest.focus();
      return;
    }

    const whatsappMessage = [
      'Hello, I would like to enquire about Ironform Fitness Studio.',
      '',
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Interested in: ${selectedInterest}`,
      `Message: ${message || 'No additional message'}`
    ].join('\n');

    const whatsappUrl = 'https://wa.me/919000000000?text=' + encodeURIComponent(whatsappMessage);
    const whatsappWindow = window.open(whatsappUrl, '_blank');

    if (whatsappWindow) {
      whatsappWindow.opener = null;
      status.textContent = 'WhatsApp opened. Review your message and tap Send to submit the enquiry.';
    } else {
      fallback.href = whatsappUrl;
      fallback.hidden = false;
      status.textContent = 'Your browser blocked the new tab. Use the link below to continue to WhatsApp.';
    }
  });
});


// Mobile navigation (kept separate from the enquiry-form handler).
document.addEventListener('DOMContentLoaded', () => {
  const navContainer = document.querySelector('.nav');
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.getElementById('primary-nav');

  if (!navContainer || !menuButton || !navigation) return;

  const closeMenu = () => {
    navContainer.classList.remove('nav-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  };

  menuButton.addEventListener('click', () => {
    const isOpen = navContainer.classList.toggle('nav-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      menuButton.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) closeMenu();
  });
});
