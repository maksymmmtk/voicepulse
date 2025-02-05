// Викликати функцію при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form');
  const firstNameInput = document.getElementById('firstName');
  const lastNameInput = document.getElementById('lastName');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');

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
        const response = await fetch('/signup/check-email', {
          method: 'POST',
          body: JSON.stringify({ email: emailInput.value }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        if(!data.valid) {
          errors['email'] = 'Хтось вже використовує цю адресу електронної пошти.';
          valid = false;
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    // Перевірка на співпадіння паролів
    if (passwordInput.value !== confirmPasswordInput.value) {
      errors['confirmPassword'] = 'Паролі не співпадають.';
      valid = false;
    }

    // Перевірка мінімальної довжини
    if (firstNameInput.value.length < 2) {
      errors['firstName'] = 'Ім\'я повинно містити мінімум 2 символи.';
      valid = false;
    }

    if (passwordInput.value.length < 8) {
      errors['password'] = 'Пароль повинен містити мінімум 8 символів.';
      valid = false;
    }

    // Перевірка максимальної довжини
    if (firstNameInput.value.length > 50) {
      errors['firstName'] = `Це поле не може містити більше 50 символів.`;
      valid = false;
    }

    if (lastNameInput.value.length > 50) {
      errors['lastName'] = `Це поле не може містити більше 50 символів.`;
      valid = false;
    }

    if (emailInput.value.length > 100) {
      errors['email'] = `Це поле не може містити більше 100 символів.`;
      valid = false;
    }

    if (passwordInput.value.length > 255) {
      errors['password'] = `Це поле не може містити більше 255 символів.`;
      valid = false;
    }

    // Перевірка на пусті поля
    [firstNameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => {
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
      form.submit(); // Відправлкння форми, якщо всі перевірки пройдені
    }
  });
});