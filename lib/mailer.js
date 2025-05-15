document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      honeypot: formData.get('company'), // hidden trap
    };

    // ✅ Wait for reCAPTCHA before submitting
    grecaptcha.ready(() => {
      grecaptcha.execute('YOUR_SITE_KEY_HERE', { action: 'submit' })
        .then(async (token) => {
          data.token = token;

          try {
            const response = await fetch('/api/contact', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });

            const text = await response.text();
            let result;

            try {
              result = JSON.parse(text);
            } catch (e) {
              console.error('Failed to parse JSON response:', text);
              if (status) status.textContent = "Server error. Please try again later.";
              return;
            }

            if (result.success) {
              if (status) status.textContent = "Message sent! Thanks.";
              form.reset();
            } else {
              if (status) status.textContent = result.error || "Something went wrong.";
            }
          } catch (err) {
            console.error('Form submit error:', err);
            if (status) status.textContent = "Network error. Try again later.";
          }
        });
    });
  });
});
