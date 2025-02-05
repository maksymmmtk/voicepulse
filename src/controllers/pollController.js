const path = require('path');
const poll = require('../models/poll')
const user = require('../models/user')

exports.getPollsData = (req, res) => {

  // Ініціалізація масивів для зберігання даних
  var poll_id = [];
  var title = [];
  var created_by = [];
  var participants_count = [];
  var created_at = [];

  // SQL запит для отримання даних з трьох таблиць
  const query = `
  SELECT * FROM polls;
  SELECT * FROM poll_participants;
  SELECT * FROM users;
  `;

  // Виконання запиту
  poll.getPollsData (query, (error, results) => {
    if (error)
      throw error;
    else {

      // Обробка результатів запиту
      for(var i = 0; i < results[0].length; i++) {

        // Заповнення масивів даними
        poll_id.push(results[0][i].id);
        title.push(results[0][i].title);
        created_at.push(results[0][i].created_at);
        participants_count.push(0);

        // Підрахунок кількості учасників для кожного опитування
        for(var j = 0; j < results[1].length; j++)
          if(results[0][i].id == results[1][j].poll_id)
            participants_count[i]++;

        // Додавання імені та прізвища творця опитування
        for(var n = 0; n < results[2].length; n++)
          if(results[0][i].created_by == results[2][n].id)
            created_by.push(`${results[2][n].first_name} ${results[2][n].last_name}`);
      }
      
      // Відправлення даних у форматі JSON
      res.json({
        pollId: poll_id,
        title: title,
        createdBy: created_by,
        participantsCount: participants_count,
        createdAt: created_at
      });
    }
  });
};

exports.getPoll = (req, res) => {
  res.sendFile(path.join(__dirname, '../views/poll.html'));
};

exports.getPollData = (req, res) => {

  // Отримання параметрів запиту
  const params = new URLSearchParams(req.query);
  const pollId = params.get('poll_id');

  // Ініціалізація змінних для зберігання даних опитування
  var title;
  var description;
  var created_by;
  var location;
  var created_at;
  var end_date;
  var poll_options_id = [];
  var poll_options_text = [];
  var poll_options_count = [];

  // SQL запит для отримання даних опитування
  const query = `
  SELECT * FROM polls WHERE id = ?;
  SELECT * FROM poll_options WHERE poll_id = ?;
  SELECT * FROM poll_participants WHERE poll_id = ?;
  `;

  // Виконання запиту
  poll.getPollData (query, pollId, (error, results) => {
    if (error)
      throw error;
    else {

      // Якщо опитування не знайдено, повертаємо повідомлення про помилку
      if (!results[0].length)
        res.json({
          message: 'error'
        });
      
      else {

        // Заповнення даних опитування
        title = results[0][0].title;
        description = results[0][0].description;
        created_by = results[0][0].created_by;
        location = results[0][0].location;
        created_at =  results[0][0].created_at;
        end_date = results[0][0].end_date;

        // Підрахунок голосів для кожного варіанту відповіді
        for (var i = 0 ; i < results[1].length; i++) {
          poll_options_id.push(results[1][i].id);
          poll_options_text.push(results[1][i].option_text);
          poll_options_count.push(0);
        }

        for (var i = 0 ; i < results[1].length; i++)
          for (var j = 0; j < results[2].length; j++)
            if(results[1][i].id == results[2][j].vote_option_id)
              poll_options_count[i]++;

        // SQL запит для отримання даних користувача
        user.getById(created_by, (error, results) => {
          if (error)
              throw error;
          else {
            created_by = `${results[0].first_name} ${results[0].last_name}`;

              // Перевірка, чи користувач вже голосував
            if (req.session.userId)
              poll.getPollParticipants(pollId, req.session.userId, (error, results) => {
                if (error)
                  throw error;
                else {

                  // Умова виконується тоді, коли користувач увійшов, але не брав участь в опитуванні
                  if (!results.length) 
                  res.json({
                    title: title,
                    description: description,
                    createdBy: created_by,
                    location: location,
                    createdAt: created_at,
                    endDate: end_date,
                    pollOptionsId: poll_options_id,
                    pollOptionsText: poll_options_text,
                    pollOptionsCount: poll_options_count,
                    loggedIn: true,
                    isParticipant: false,
                  });

                  // Умова виконується тоді, коли користувач увійшов і брав участь в опитуванні
                  else
                  res.json({
                    title: title,
                    description: description,
                    createdBy: created_by,
                    location: location,
                    createdAt: created_at,
                    endDate: end_date,
                    pollOptionsId: poll_options_id,
                    pollOptionsText: poll_options_text,
                    pollOptionsCount: poll_options_count,
                    loggedIn: true,
                    isParticipant: true,
                  });
                }
              });

            // Умова виконується тоді, коли користувач не увійшов
            else
                res.json({
                  title: title,
                  description: description,
                  createdBy: created_by,
                  location: location,
                  createdAt: created_at,
                  endDate: end_date,
                  pollOptionsId: poll_options_id,
                  pollOptionsText: poll_options_text,
                  pollOptionsCount: poll_options_count,
                  loggedIn: false,
                });
            }
        });
      }
    }
  });
};

exports.option = (req, res) => {

  // Отримання вибраного варіанту відповіді та ID опитування
  const option = req.body.radio;
  const params = new URLSearchParams(req.query);
  const pollId = params.get('poll_id');

  // Якщо користувач увійшов, додаємо його голос
  if (req.session.userId) {
    poll.option(req.session.userId, pollId, option, (error, results) => {
      if (error)
          throw error;
    });
  }

  // Перенаправлення користувача назад на сторінку опитування
  res.redirect(`/services/poll?poll_id=${pollId}`);
};