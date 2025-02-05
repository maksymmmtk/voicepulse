const params = new URLSearchParams(window.location.search);
const pollId = params.get('poll_id');

// Викликати функцію при завантаженні сторінки для виведення даних про опитування
document.addEventListener('DOMContentLoaded', function () {
  fetch(`/api/poll?poll_id=${pollId}`, { credentials: 'include' })
    .then(response => response.json())
    .then(data => {
      if (data.message == 'error')
        window.location.assign(`/${data.message}`);
      else {
        var participantsCount = 0;
        const createdAt = new Date(data.createdAt);
        const shortCreatedAt = createdAt.toLocaleDateString('uk-UA');
        const endDate = new Date(data.endDate);
        const shortEndDate = endDate.toLocaleDateString('uk-UA');

        for (var i = 0; i < data.pollOptionsCount.length; i++)
          participantsCount += data.pollOptionsCount[i];

        document.getElementById('createdBy').textContent = data.createdBy;
        document.getElementById('title').textContent = data.title;
        document.getElementById('description').textContent = data.description;
        document.getElementById('participantsCount').textContent = participantsCount;
        document.getElementById('location').textContent = data.location;
        document.getElementById('createdAt').textContent = shortCreatedAt;
        document.getElementById('endDate').textContent = shortEndDate;

        if(!data.loggedIn)
          document.getElementById('vote-option-container').innerHTML = `
          <p>Для того, щоб проголосувати необхідно <a href="/login"><span>УВІЙТИ</span></a></p>
          <form id="radio-form-submit" class="radio-form flex" method="post"></form>
          `;
        else if (data.isParticipant)
          document.getElementById('vote-option-container').innerHTML = `
          <p>Ваша відповідь збережена! <a href="/services"><span>ДО ОПИТУВАНЬ</span></a></p>
          <form id="radio-form-submit" class="radio-form flex" method="post"></form>
          `;
        else
          document.getElementById('vote-option-container').innerHTML = `
          <p>Оберіть з декількох варіантів лише один варіант відповіді:</p>
          <form id="radio-form-submit" class="radio-form flex" method="post"></form>
          `;

        for (var i = 0; i < data.pollOptionsId.length; i++)
          document.getElementById('radio-form-submit').innerHTML += `
          <label class="label-container flex">
          <article class="form-option flex">
          <input type="radio" name="radio" class="input-radio" value="${data.pollOptionsId[i]}">
          <p>${data.pollOptionsText[i]}</p>
          </article>              
          <article class="number-votes flex">
          <p></p>
          <article>
          <p>${participantsCount == 0 ? 0 : (data.pollOptionsCount[i]/participantsCount*100).toFixed(2)}%</p>
          <p>${data.pollOptionsCount[i]}</p>
          </article>
          </article>              
          </label>
          `;

        if (data.loggedIn && !data.isParticipant) {
          document.getElementById('radio-form-submit').action = `/api/option?poll_id=${pollId}`;
          document.getElementById('radio-form-submit').innerHTML += '<input type="submit" class="vote-submit" value="Надіслати">';
        }
        else
          document.getElementById('radio-form-submit').innerHTML += `
          <style>
          .input-radio {
            display: none;
          }
          </style>
          `;
      }
  })
  .catch(error => console.error('Error:', error));
});