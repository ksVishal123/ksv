/* ==========================================================================
   ROYAL GOLD & DIAMONDS - Contact, Concierge & Showrooms Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  setupConciergeBookingForm();
  setupContactForm();
});

function setupConciergeBookingForm() {
  const form = document.getElementById('concierge-booking-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('book-name').value.trim();
    const date = document.getElementById('book-date').value;
    const showroom = document.getElementById('book-showroom').value;

    window.showToast(
      "VIP Appointment Confirmed", 
      `Namaste ${name}, our Senior Jewellery Concierge at ${showroom} has reserved your private suite on ${date}.`, 
      "success"
    );
    form.reset();
  });
}

function setupContactForm() {
  const form = document.getElementById('general-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    window.showToast(
      "Inquiry Received", 
      "Thank you for contacting ROYAL GOLD & DIAMONDS. Our master bespoke specialist will reply within 4 business hours.", 
      "info"
    );
    form.reset();
  });
}
