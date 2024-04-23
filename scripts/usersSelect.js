import * as importConfig from "./dev/config.js";

var usersFromGroup = {
  'Тестова група': ['Тестовий користувач 1', 'Тестовий користувач 2', 'Тестовий користувач 3',],

  'Вчителі': ['Бабій Василь Дмитрович','Боровська-Карандюк Ірина Анатоліївна','Варганова Діна Олександрівна','Венцель Наталія Василівна','Гетманська Марія Олександрівна','Геча Олена Анатоліївна','Глібко Ірина Анатоліївна','Гончарук Наталія Олександрівна','Забелло Лариса Олександрівна','Зинюк Наталія Миколаївна','Кучер Наталія Вікторівна','Лознюк Анжела Леонідівна','Медведєва Марія Василівна','Нелипович Вікторія Віталіївна','Пузіна Оксана Станіславівна','Савінков Тарас Євгенович','Чугунов Сергій Олександрович','Чугунова Олена Василівна','Шатківський Віталій Миколайович'],

  '10-А': [
    'Булич Катерина', 'Гайдайчук Владислав', 'Геча Кирило', 'Громова Марина', 'Гуменюк Аріна', 'Демидчук Ілля', 'Деркач Єлизавета', 'Євланов Даніїл', 'Кайданюк Ілля', 'Ковальов Андрій', 'Кожанов Юрій', 'Козлюк Марина', 'Кравчук Іван', 'Лазаренко Софія', 'Марценюк Вадим', 'Мединський Роман', 'Михальський Нікіта', 'Недзвецький Олег', 'Ніцкевич Дар\'я', 'Присяжнюк Богдана', 'Сікалюк Артем', 'Соболь Давид', 'Соломонюк Богдан', 'Столяров Руслан', 'Столярчук Дмитро', 'Ткач Кирил', 'Філімончук Євгеній', 'Хмєль Ілля', 'Шпонарський Ілля', 'Якубець Денис'
  ],
  '10-Б': ['Тестовий користувач',
    'Башинська Вікторія', 'Біденко Дмитро', 'Бовсуновський Максим', 'Волинець Владислав', 'Галетко Артем', 'Гордійчук Богдан', 'Гоцман Артем', 'Гуменюк Олег', 'Дєдух Ілля', 'Дідківський Андрій', 'Дубок Михаїл', 'Заєць Богдан', 'Кравчук Андрій', 'Кучер Максим', 'Лавренко Карина', 'Лещенко Анастасія', 'Лобода Софія', 'Найбородін Артем', 'Нікітіч Олександр', 'Продоус Олександр', 'Прокопчук Денис', 'Савицький Єгор', 'Саух Тимофій', 'Скримінська Оксана', 'Смолянова Ніка', 'Соколовська Вікторія', 'Терський Дмитро', 'Тищенко Артем', 'Химач Денис', 'Шапіренко Максим'
  ],
  '10-В': [
    'Амер Маріам', 'Андрусевич Захар', 'Бартковяк Даніела', 'Бевз Софія', 'Борщівська Магдалина', 'Вишневський Іван', 'Вітюк Дмитро', 'Габрук Софія', 'Ганжела Єгор', 'Грищук Єлизавета', 'Іванов Тимофій', 'Козлова Діна', 'Контефт Владислав', 'Косюк Вікторія', 'Кравченко Нікіта', 'Куліковська Оксана', 'Лугіна Марія', 'Мазуркевич Катерина', 'Масловська Каміла', 'Мельниченко Кароліна', 'Мясковський Олексій', 'Опанасенко Крістіна', 'Павлюк Софія', 'Паламарчук Вікторія', 'Пасічник Марія', 'Сахневич Діана', 'Степаненко Анна', 'Теличенко Ангеліна', 'Хлистун Поліна', 'Чиршакова Анастасія', 'Шапіренко Андрій', 'Шершньова Надія'
  ],
  '10-Г': [
    'Алтухова Катерина', 'Булдакова Валерія', 'Вербило Тетяна', 'Григанська Юлія', 'Гринь Максим', 'Грицай Олександра', 'Дзюблик Валерія', 'Дідківська Каріна', 'Длогуш Богдан', 'Забродська Марія', 'Збаражський Орест', 'Ігумнова Марина', 'Ільчук Олександр', 'Карпенко Аліна', 'Кирик Юлія', 'Когут Аріна', 'Коритко Ярослав', 'Мазур Дмитро', 'Михальчук Леся', 'Онищук Юлія', 'Пєнишева Валерія', 'Плис Марія', 'Поліщук Анна', 'Поліщук Каріна', 'Сидоренко Дарина', 'Сліпцов Владислав', 'Тарнавська Марія', 'Томчук Єлизавета', 'Халковська Ангеліна', 'Хоменко Вікторія', 'Черниш Дар\'я'],
  '11-А': [
    'Аверін  Кирил', 'Андронік Аліна', 'Антонюк  Володимир ', 'Бас Дмитро', 'Власов Арсеній', 'Войтович Марина', 'Гаврилюк  Назарій ', 'Гаврилюк  Назарій ', 'Герасимчук Владислав', 'Данілін Кирило ', 'Діжа Олексій', 'Духніч  Анастасія ', 'Зубрицький Арсеній', 'Карнажицький  Іван', 'Катунов Данііл', 'Кащук Тимур', 'Касьянов Антон', 'Корячков  Віктор', 'Крачковський Артем', 'Лаетін Дмитро', 'Милостивий Артем', 'Ніколенко Богдан', 'Омельчук  Олександр ', 'Парфенюк  Вікторія', 'Петренко Валерія', 'Сархан Назар', 'Сархан Назар', 'Сархан  Назар', 'Сова  Олександр ', 'Стенюк  Марина', 'Танський  Лев ', 'Хоменко Дмитро'
  ],
  '11-Б': [
    'Багінський  Ілля', 'Головня  Богдан', 'Горностай  Анастасія ', 'Губін  Владислав ', 'Задоєнко  Роман','Кавешніков Артем', 'Карталіш  Оскар', 'Кирій Глєб', 'Коломієць  Артем ', 'Копаниця Дмитро', 'Кошарська Анастасія ', 'Кошицький Олексій','Ляховець Ангеліна', 'Мельниченко Іван', 'Михалюк Софія', 'Місіонжнік Нікіта', 'Новак Данило', 'Павелеску Іван', 'Павлюк Дарина', 'Романчук Максим', 'Рослякова Ніна', 'Слівко Микола', 'Соколов Владислав', 'Степанюк Олексій', 'Ущапівський Іван', 'Ущапівський Іван', 'Фотін Андрій', 'Хоменко Владислав', 'Хомик Анна', 'Шахрай Артем'
  ]
  ,
  '11-В': [
    'Алексеєва Юлія','Афонін Тимофій','Барибіна Софія','Бірюченко Дарія','Булуй Олег','Василевський Давид','Вексей Богдан','Кінолевський Артур','Гаврилюк Діана','Дворецька Анастасія','Дзиба Альбіна','Загрива Софія','Ковпак Євген','Кожушко Олексій','Кондратюк Дар\'я','Кравчук Катерина','Кухарук Данило','Левандовський Михайло','Лозовий Єгор','Лонська Надія','Макарчук Богдан','Мартинюк Катерина','Плєвако Ярослав','Полякова Поліна','Сіваченко Анастасія','Тихонова Аліна','Чернишов Данііл','Оберемчук Вікторія','Любич Вадим','Кучейник Діана'
  ],
  '11-Г': [
    'Аляб’єв Ілля', 'Богданевич Анастасія', 'Бончук Олександра', 'Вардовська Олександра', 'Венгловська Євгенія', 'Власова Анастасія', 'Гаврилюк Каміла', 'Єні Євген', 'Зірченко Карина', 'Колесник Людмила', 'Кравченко Владислава', 'Криворука Софія', 'Лєдньов Михайло', 'Лисак Іван', 'Нітрян Анна', 'Остапенко Анастасія', 'Петровський Владислав', 'Портнягіна Альона', 'Ратушинська Дарина', 'Рибачок Роман', 'Руских Вікторія', 'Сербіна Анастасія', 'Сердонюк Назар', 'Сич Антон', 'Сікан Аліна', 'Собченко Богдан', 'Станіславська Вероніка', 'Умінська Юлія', 'Харина Олександра', 'Шевченко Олена', 'Шимон Світлана', 'Шукалович Дмитро', 'Ярмоченко Марія'
  ],

}





//Отримання та відображенння списку класів
// Отримання посилання на елемент випадаючого списку
var groupSelect = document.getElementById('group-input');

// Перевірка наявності елементу та очищення випадаючого списку
if (groupSelect) {
  groupSelect.innerHTML = ''; // Очищення вмісту випадаючого списку

  // Створюємо перший елемент опції з текстом "Оберіть студента"
  var defaultOption = document.createElement('option');
  defaultOption.textContent = 'Оберіть групу';
  defaultOption.disabled = true; // Робимо його неактивним
  defaultOption.selected = true; // Робимо його обраним за замовчуванням
  groupSelect.appendChild(defaultOption);

  // Прохід по ключам об'єкта usersFromGroup
  for (var key in usersFromGroup) {
    // Створення нового елементу випадаючого списку
    var option = document.createElement('option');
    // Додавання значення ключа як текстового вмісту елементу
    option.textContent = key;
    option.value = key;
    // Додавання елементу до випадаючого списку
    groupSelect.appendChild(option);
  }
}

// Отримання посилання на елемент випадаючого списку студентів
var studentSelect = document.getElementById('name-input');


// Додаємо подію "change" до випадаючого списку класів
groupSelect.addEventListener('change', showStudents);


function showStudents(selectedClass=groupSelect.value) {
  // Очищаємо випадаючий список студентів
  studentSelect.innerHTML = '';

  // Отримуємо обраний клас
  var selectedClass = groupSelect.value;

  // Отримуємо список студентів для обраного класу
  var students = usersFromGroup[selectedClass];

  // Створюємо перший елемент опції з текстом "Оберіть студента"
  var defaultOption = document.createElement('option');
  defaultOption.textContent = 'Всі учні';
  //defaultOption.disabled = true; // Робимо його неактивним
  defaultOption.selected = true; // Робимо його обраним за замовчуванням
  studentSelect.appendChild(defaultOption);

  // Якщо список студентів не порожній
  if (students && students.length > 0) {
    // Проходимо по списку студентів та додаємо їх до випадаючого списку
    students.forEach(function (student) {
      var option = document.createElement('option');
      option.textContent = student;
      option.value = student;
      studentSelect.appendChild(option);
    });
  }
}

if (importConfig.adminMode == 1){
  console.log("admMode")
  groupSelect.value = "Тестова група";
  showStudents("Тестова група")
  studentSelect.value = "Тестовий користувач 1"
}