// Викликати функцію при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  form.addEventListener('submit', async function(event) {
    event.preventDefault();
    let valid = true;
    let errors = {};

    // Валідація електронної пошти
    if (!/\S+@\S+\.\S+/.test(emailInput.value)) {
      errors['email'] = 'Будь ласка, введіть коректну адресу електронної пошти.';
      valid = false;
    }
    else {
      try {
        const response = await fetch('/login/authentication', {
          method: 'POST',
          body: JSON.stringify({ email: emailInput.value, password: passwordInput.value}),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        if(!data.valid) {
          errors['password'] = 'Неправильна електронна адреса або пароль.';
          valid = false;
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    // Перевірка на пусті поля
    [emailInput, passwordInput].forEach(input => {
      if (!input.value.trim()) {
        const fieldName = input.previousElementSibling.textContent;
        errors[input.id] = `Це поле не може бути пустим.`;
        valid = false;
      }
    });

    // Видалення попередніх повідомлень про помилки
    document.querySelectorAll('.error').forEach(el => el.remove());

    // Виведення повідомлень про помилки
    for (const id in errors) {
      const errorElement = document.createElement('div');
      errorElement.className = 'error';
      errorElement.textContent = errors[id];
      const inputElement = document.getElementById(id);
      inputElement.insertAdjacentElement('afterend', errorElement);
    }

    if (valid) {
      form.submit(); // Відправте форму, якщо всі перевірки пройдені
    }
  });
});