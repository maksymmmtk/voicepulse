// Викликати функцію при завантаженні сторінки для перевірки чи користувач увійшов
document.addEventListener('DOMContentLoaded', async function () {
  try {
    const response = await fetch('/api/check-login', { credentials: 'include' });
    const data = await response.json();

    // Користувач залогінений
    if (data.loggedIn) {
      const createdAt = new Date(data.createdAt);
      const shortCreatedAt = createdAt.toLocaleDateString('uk-UA');

        document.getElementById('right-side-reg').innerHTML += `
        <div class="dropdown-profile">
          <p class="dropdown-profile-btn"></p>
          <div class="dropdown-content flex">
            <p>${data.fullName}</p>
            <p>${data.email}</p>
            <div class="profile-data-reg flex">
              <p></p>
              <div class="flex">
                <p>Дата реєстрації:</p>
                <p>${shortCreatedAt}</p>
              </div>
            </div>
            <a class="logout_btn flex" href='/logout'>Вийти</a>
          </div>
        </div>

      <style>
      .right-side-reg.flex {
        display: flex;
      }
      </style>
        `;
    }
    
    // Користувач не залогінений
    else {
      document.getElementById('header_btn').innerHTML += `<a href="/login" class="header_btn">УВІЙТИ</a>`;
      document.getElementById('dropdown_menu').innerHTML += `<li><a href="/login" class="header_btn">УВІЙТИ</a></li>`;
    }
  } catch (error) {
    console.error('Error:', error);
  }

  // Скрипт для випадаючого вікна
  const toggleBtn = document.querySelector('.toggle_btn');
  const toggleBtnIcon = document.querySelector('.toggle_btn i');
  const dropDownMenu = document.querySelector('.dropdown_menu');
  
  toggleBtn.onclick = function () {
    dropDownMenu.classList.toggle('open');
    const isOpen = dropDownMenu.classList.contains('open') ;
    toggleBtnIcon.classList = isOpen
          ? 'fa-solid fa-xmark'
          : 'fa-solid fa-bars'
  }
});