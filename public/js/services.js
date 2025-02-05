// Викликати функцію при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function () {
    fetch('/api/services', { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
        for(var i = 0; i < data.pollId.length; i++) {
            const createdAt = new Date(data.createdAt[i]);
            const shortCreatedAt = createdAt.toLocaleDateString('uk-UA');

            document.getElementById('pollsContainer').innerHTML += `
            <article class="works__item flex">          
            
            <div class="flex">
            <article>
                <a href="./services/poll?poll_id=${data.pollId[i]}"><h3>${data.title[i]}</h3></a>
                <article class="init flex">
                <a></a>
                <p>${data.createdBy[i]}</p>
            </article>
            </article>
            <article class="vote-status card vflex">
                    <a></a>
                    <p>${data.participantsCount[i]}</p>
                    <p>голосів</p>
                </article>
            <article class="date_ins flex">
                <a></a>
                <p>${shortCreatedAt}</p>
            </article>                                         
            </div>          
            
            </article>
            `;
        }
    })
    .catch(error => console.error('Error:', error));
});