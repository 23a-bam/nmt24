import * as importConfig from "../dev/config.js";
import * as impHttp from "../http/api-router.js";
import * as impPopups from "../components/popups.js";
import * as impSubject200 from "../convert200.js";
import * as impCreateAnswers from "../components/createAnswersBlock.js";

adminLogin();

async function adminLogin() {
  let loginForm = document.querySelector(".admin-page__login");
  if (!loginForm) return;
  let authResponse = await impHttp.isAuth();
  if (authResponse.status == 200) {
    //console.log(window.userInfo);

    if (window?.userInfo?.roles?.includes("ADMIN")) {
      loginForm.remove();
      adminPage();
    } else {
      location.href = importConfig.client_url;
      alert("В вас немає прав адміністратора");
    }
  } else {
    let button = loginForm.querySelector(".admin-page__login-submit");
    button.addEventListener("click", async function (e) {
      e.preventDefault();
      let email = document.querySelector(".admin-page-email").value;
      let password = document.querySelector(".admin-page-password").value;
      let loginResponse = await impHttp.login(email, password);
      if (loginResponse.status == 200) {
        loginForm.remove();
        adminPage();
      }
    });
  }
}

async function getUsersAnswersInformation() {
  const usersAnswersResponse = await impHttp.getAllUserAnswers();
  if (usersAnswersResponse.status !== 200) {
    return Promise.reject(
      new Error(`Помилка отримання даних: ${usersAnswersResponse.data.message}`)
    );
  }
  return usersAnswersResponse.data;
}

async function getTestsInformation() {
  try {
    const { status, data } = await impHttp.getAllTestsFromDB();
    if (status !== 200) throw new Error(data.message);
    return data;
  } catch (error) {
    alert("Помилка отримання даних: " + error.message);
  }
}

async function getUsersInformation() {
  try {
    const { status, data } = await impHttp.getAllUsers();
    if (status !== 200) throw new Error(data.message);
    return data;
  } catch (error) {
    alert("Помилка отримання даних: " + error.message);
  }
}

let testsInfo = await getTestsInformation();

async function adminPage() {
  const [usersAnswersInfo, usersInfo] = await Promise.all([
    getUsersAnswersInformation(),
    getUsersInformation(),
  ]);

  showAllUsers(usersAnswersInfo);
  await createSelectButton(usersInfo, usersAnswersInfo);
}

function showAllUsers(usersInfo) {
  const resultsBlock = document.querySelector(".user-results");
  if (!resultsBlock) {
    return alert("Помилка! Блок результатів не знайдено");
  }
  const uniqueUsers = Array.from(
    new Map(usersInfo.map((user) => [user.username, user])).values()
  );
  const sortedUniqueUsers = uniqueUsers.sort((a, b) =>
    new Date(b.passDate).getTime() - new Date(a.passDate).getTime()
  );
  resultsBlock.innerHTML = "";
  sortedUniqueUsers.forEach((user) => {
    const generalUserElement = document.createElement("div");
    generalUserElement.classList.add("general-user-block");
    resultsBlock.appendChild(generalUserElement);
    impCreateAnswers.createUserBlockAdm(
      generalUserElement,
      testsInfo,
      usersInfo.filter((u) => u.username === user.username),
      null,
      null,
      null,
      null,
      null
    );
  });
}

function getFilrationParams() {
  let subject = document.querySelector(".selectSubject")?.getAttribute("value");
  if (!subject || subject == "null") {
    subject = null;
  }
  if (typeof subject == "string") {
    subject = JSON.parse(subject);
  }

  let student = document.querySelector(".selectStudent")?.getAttribute("value");
  if (!student || student == "null") {
    student = null;
  }

  let group = document.querySelector(".selectGroup")?.getAttribute("value");
  if (!group || group == "null") {
    group = null;
  }

  let date = document.querySelector(".selectDate")?.getAttribute("value");
  if (!date || date == "null") {
    date = null;
  }
  if (typeof date == "string") {
    date = JSON.parse(date);
  }

  let mark = document.querySelector(".selectMark")?.getAttribute("value");
  if (!mark || mark == "null") {
    mark = null;
  }

  let subgroup = document.querySelector(".selectSubgroup")?.getAttribute("value");
  if (!subgroup || subgroup == "null") {
    subgroup = null;
  }

  let variant = document.querySelector(".selectVariant")?.getAttribute("value");
  if (!variant || variant == "null") {
    variant = null;
  }

  return { student, group, subgroup, subject, date, mark, variant };
}

// Функція для збереження параметрів фільтрації
function saveFilterParams() {
  const params = getFilrationParams();
  localStorage.setItem('filterParams', JSON.stringify(params));
}

// Функція для відновлення параметрів фільтрації
function restoreFilterParams() {
  const savedParams = JSON.parse(localStorage.getItem('filterParams') || '{}');
  const selects = document.querySelectorAll('select');
  selects.forEach(select => {
    if (savedParams[select.className]) {
      select.value = savedParams[select.className];
      select.setAttribute('value', savedParams[select.className]);
    }
  });

  const dateInput = document.querySelector('.selectDate');
  if (savedParams.date) {
    dateInput.value = new Date(savedParams.date).toISOString().split('T')[0];
    dateInput.setAttribute('value', savedParams.date);
  }
}


async function createSelectButton(usersInfo, usersAnswersInfo) {
  // сортування по даті по дефолту
  usersAnswersInfo.sort((a, b) => {
    return new Date(b.passDate) - new Date(a.passDate);
  });
  //Вибір Предмету
  let selectSubject = document.querySelector(".selectSubject");
  if (!selectSubject) {
    return;
  }
  const uniqueSubject = new Set(usersAnswersInfo.map((item) => item.subject));

  const subjectArray = Array.from(uniqueSubject).sort();
  subjectArray.forEach((subjectCode) => {
    let subject = impCreateAnswers.setSubjectNameBySubject(subjectCode);
    let option = document.createElement("option");
    option.setAttribute("value", subjectCode);
    option.innerHTML = subject;
    selectSubject.appendChild(option);
  });
  selectSubject.addEventListener("change", function (e) {
    let selectedOption = selectSubject.options[selectSubject.selectedIndex];
    let subjectValue = selectedOption.value;
    if (subjectValue == "null" || !subjectValue) {
      subjectValue = null;
    }
    selectSubject.setAttribute("value", subjectValue);

    // Оновлюємо варіанти тестів при зміні предмету
    updateVariants(subjectValue, usersAnswersInfo);

    updateResults(usersAnswersInfo);
    saveFilterParams();
  });

  //Вибір групи
  let groupSelect = document.querySelector(".selectGroup");
  if (!groupSelect) {
    return;
  }

  let uniqueGroups = new Set(usersInfo.map((user) => user.group));
  uniqueGroups = Array.from(uniqueGroups).sort();

  uniqueGroups.forEach((group) => {
    let option = document.createElement("option");
    option.setAttribute("value", group);
    option.innerHTML = group;
    groupSelect.appendChild(option);
  });

  groupSelect.addEventListener("change", function (e) {
    let selectedOption = groupSelect.options[groupSelect.selectedIndex];
    let groupValue = selectedOption.value;
    if (groupValue == "null" || !groupValue) {
      groupValue = null;
    }
    groupSelect.setAttribute("value", groupValue);

    // Оновлюємо список студентів відповідно до вибраної групи
    let studentSelect = document.querySelector(".selectStudent");
    if (studentSelect) {
      // Очищаємо поточний список
      studentSelect.innerHTML = '<option value="null">Всі учні</option>';

      // Фільтруємо студентів по вибраній групі та підгрупі
      let filteredUsers = usersInfo;

      if (groupValue) {
        filteredUsers = filteredUsers.filter(user => user.group === groupValue);
      }

      // Перевіряємо вибрану підгрупу
      let selectedSubgroup = document.querySelector(".selectSubgroup")?.getAttribute("value");
      if (selectedSubgroup && selectedSubgroup !== "null") {
        filteredUsers = filteredUsers.filter(user => user.subgroup === selectedSubgroup);
      }

      // Сортуємо по імені
      filteredUsers.sort((a, b) => a.name.localeCompare(b.name));

      // Додаємо відфільтрованих студентів
      filteredUsers.forEach((user) => {
        let option = document.createElement("option");
        option.setAttribute("value", user._id);
        option.innerHTML = user.name;
        studentSelect.appendChild(option);
      });

      // Скидаємо вибраного студента
      studentSelect.value = "null";
      studentSelect.setAttribute("value", null);
    }

    // Оновлюємо список підгруп відповідно до вибраної групи
    let subgroupSelect = document.querySelector(".selectSubgroup");
    if (subgroupSelect) {
      // Очищаємо поточний список
      subgroupSelect.innerHTML = '<option value="null">Всі підгрупи</option>';

      if (groupValue) {
        // Знаходимо унікальні підгрупи для вибраної групи
        let groupUsers = usersInfo.filter(user => user.group === groupValue);
        let uniqueSubgroups = [...new Set(groupUsers.map(user => user.subgroup))].filter(Boolean);
        uniqueSubgroups.sort();

        // Додаємо підгрупи
        uniqueSubgroups.forEach((subgroup) => {
          let option = document.createElement("option");
          option.setAttribute("value", subgroup);
          option.innerHTML = `Підгрупа ${subgroup}`;
          subgroupSelect.appendChild(option);
        });
      }

      // Скидаємо вибрану підгрупу
      subgroupSelect.value = "null";
      subgroupSelect.setAttribute("value", null);
    }

    // Оновлюємо результати
    updateResults(usersAnswersInfo);
    saveFilterParams();
  });

  //Вибір по даті
  let selectDate = document.querySelector(".selectDate");
  if (!selectDate) {
    return;
  }

  selectDate.addEventListener("change", function (e) {
    let dateValue = new Date(selectDate.value).setHours(0, 0, 0, 0);

    if (dateValue == "null" || !dateValue) {
      dateValue = null;
    }
    selectDate.setAttribute("value", dateValue);
    // виводимо інформацію
    let resultsBlock = document.querySelector(".user-results");
    if (!resultsBlock) {
      return alert("Помилка! Блок результатів не знайдено");
    }
    resultsBlock.innerHTML = "";
    let { student, group, subject, date } = getFilrationParams();

    impCreateAnswers.createUserBlockAdm(
      resultsBlock,
      testsInfo,
      usersAnswersInfo,
      student,
      group,
      subject,
      date
    );
  });

  //Вибір студента
  let studentSelect = document.querySelector(".selectStudent");
  if (!studentSelect) {
    return;
  }

  usersInfo.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  usersInfo.forEach((user) => {
    let option = document.createElement("option");
    option.setAttribute("value", user._id);
    option.innerHTML = user.name;
    studentSelect.appendChild(option);
  });

  studentSelect.addEventListener("change", function (e) {
    let selectedOption = studentSelect.options[studentSelect.selectedIndex];
    let studentValue = selectedOption.value;
    if (studentValue == "null") {
      studentValue = null;
    }
    studentSelect.setAttribute("value", studentValue);

    // Якщо вибрано студента, автоматично встановлюємо його групу і підгрупу
    if (studentValue) {
      const selectedStudent = usersInfo.find(user => user._id === studentValue);
      if (selectedStudent) {
        // Встановлюємо групу
        let groupSelect = document.querySelector(".selectGroup");
        if (groupSelect) {
          groupSelect.value = selectedStudent.group;
          groupSelect.setAttribute("value", selectedStudent.group);
        }

        // Встановлюємо підгрупу
        let subgroupSelect = document.querySelector(".selectSubgroup");
        if (subgroupSelect && selectedStudent.subgroup) {
          subgroupSelect.value = selectedStudent.subgroup;
          subgroupSelect.setAttribute("value", selectedStudent.subgroup);
        }
      }
    }

    updateResults(usersAnswersInfo);
    saveFilterParams();
  });

  //Вибір оцінки для фільтрації результатів за оцінкою .result-item__score b:last-child

  let markSelect = document.querySelector(".selectMark");
  if (markSelect) {
    // Додаємо опції для оцінок від 1 до 12
    for (let i = 1; i <= 12; i++) {
      let option = document.createElement("option");
      option.setAttribute("value", i);
      option.innerHTML = i;
      markSelect.appendChild(option);
    }

    markSelect.addEventListener("change", function (e) {
      let selectedOption = markSelect.options[markSelect.selectedIndex];
      let markValue = selectedOption.value;
      if (markValue == "null") {
        markValue = null;
      }

      let resultsBlock = document.querySelector(".user-results");
      let resultItems = Array.from(resultsBlock.querySelectorAll(".result-item"));
      resultItems.forEach(item => {
        let userMarkValue = item.querySelector(".result-item__score")?.textContent.match(/Оцінка:\s*(\d+)/)[1] || "0";
        console.log('userMarkValue ', userMarkValue);
      });


      markSelect.setAttribute("value", markValue);
     
      updateResults(usersAnswersInfo);
      saveFilterParams();
    });
  }

  // Додаємо вибір підгрупи
  let subgroupSelect = document.querySelector(".selectSubgroup");
  if (subgroupSelect) {
    const subgroups = ["1", "2"];
    subgroups.forEach((subgroup) => {
      let option = document.createElement("option");
      option.setAttribute("value", subgroup);
      option.innerHTML = `Підгрупа ${subgroup}`;
      subgroupSelect.appendChild(option);
    });

    subgroupSelect.addEventListener("change", function (e) {
      let selectedOption = subgroupSelect.options[subgroupSelect.selectedIndex];
      let subgroupValue = selectedOption.value;
      if (subgroupValue == "null") {
        subgroupValue = null;
      }
      subgroupSelect.setAttribute("value", subgroupValue);

      // Оновлюємо список студентів при зміні підгрупи
      let studentSelect = document.querySelector(".selectStudent");
      if (studentSelect) {
        // Очищаємо поточний список
        studentSelect.innerHTML = '<option value="null">Всі учні</option>';

        // Фільтруємо студентів
        let filteredUsers = usersInfo;

        // Перевіряємо вибрану групу
        let selectedGroup = document.querySelector(".selectGroup")?.getAttribute("value");
        if (selectedGroup && selectedGroup !== "null") {
          filteredUsers = filteredUsers.filter(user => user.group === selectedGroup);
        }

        // Фільтруємо по підгрупі
        if (subgroupValue) {
          filteredUsers = filteredUsers.filter(user => user.subgroup === subgroupValue);
        }

        // Сортуємо по імені
        filteredUsers.sort((a, b) => a.name.localeCompare(b.name));

        // Додаємо відфільтрованих студентів
        filteredUsers.forEach((user) => {
          let option = document.createElement("option");
          option.setAttribute("value", user._id);
          option.innerHTML = user.name;
          studentSelect.appendChild(option);
        });

        // Скидаємо вибраного студента
        studentSelect.value = "null";
        studentSelect.setAttribute("value", null);
      }

      updateResults(usersAnswersInfo);
      saveFilterParams();
    });
  }

  // Додаємо кнопку скидання фільтрів
  let resetButton = document.querySelector(".reset-filters");
  if (resetButton) {
    resetButton.addEventListener("click", function () {
      document.querySelector(".selectSubject").value = "null";
      document.querySelector(".selectStudent").value = "null";
      document.querySelector(".selectGroup").value = "null";
      document.querySelector(".selectSubgroup").value = "null";
      document.querySelector(".selectDate").value = "";
      document.querySelector(".selectMark").value = "null";
      document.querySelector(".selectVariant").value = "null";

      // Скидаємо атрибути
      document.querySelector(".selectSubject").setAttribute("value", null);
      document.querySelector(".selectStudent").setAttribute("value", null);
      document.querySelector(".selectGroup").setAttribute("value", null);
      document.querySelector(".selectSubgroup").setAttribute("value", null);
      document.querySelector(".selectDate").setAttribute("value", null);
      document.querySelector(".selectMark").setAttribute("value", null);
      document.querySelector(".selectVariant").setAttribute("value", null);

      localStorage.removeItem('filterParams');
      updateResults(usersAnswersInfo);
    });
  }

  // Додаємо збереження параметрів при зміні селектів
  const selectors = [".selectSubject", ".selectStudent", ".selectGroup", ".selectSubgroup", ".selectDate", ".selectMark"];
  selectors.forEach(selector => {
    document.querySelector(selector)?.addEventListener("change", function () {
      saveFilterParams();
    });
  });

  // Відновлюємо збережені параметри при завантаженні
  restoreFilterParams();
  updateResults(usersAnswersInfo);

  if (allTestsResponse.status != 200) {
    return alert("Неможливо отримати тест");
  }
  testsInfo = allTestsResponse.data;

  if (profileInfo.roles.includes("ADMIN")) {
    impCreateAnswers.createUserBlockAdm(
      resultsBlock,
      testsInfo,
      userTestsInfo
    );
  } else {
    impCreateAnswers.createUserBlock(resultsBlock, testsInfo, userTestsInfo, null, null, null, null, null);
  }
}

// Функція оновлення результатів
function updateResults(usersAnswersInfo) {
  let resultsBlock = document.querySelector(".user-results");
  if (!resultsBlock) {
    return alert("Помилка! Блок результатів не знайдено");
  }
  resultsBlock.innerHTML = "";
  let { student, group, subgroup, subject, date, mark, variant } = getFilrationParams();

  impCreateAnswers.createUserBlockAdm(
    resultsBlock,
    testsInfo,
    usersAnswersInfo,
    student,
    group,
    subject,
    date,
    mark,
    subgroup,
    variant
  );
}

// Функція оновлення варіантів тестів
function updateVariants(subjectValue, usersAnswersInfo) {
  const variantSelect = document.querySelector(".selectVariant");
  console.log("Variant select element:", variantSelect);

  if (!variantSelect) return;

  const variantLinks = document.querySelectorAll('.aTagToDocument');
  //console.log("Variant links found:", variantLinks);

  const variants = [...new Set(Array.from(variantLinks).map(link => link.textContent))];
  console.log("Unique variants:", variants);

  variants.sort((a, b) => a.localeCompare(b));
  console.log("Sorted variants:", variants);

  variantSelect.innerHTML = `<option value="null">Всі варіанти</option>${variants.map(variant => `<option value="${variant}">${variant}</option>`).join('')}`;
  console.log("Updated variant select innerHTML:", variantSelect.innerHTML);

  variantSelect.addEventListener("change", function (e) {
    const selectedOption = variantSelect.options[variantSelect.selectedIndex];
    const variantValue = selectedOption.value === "null" ? null : selectedOption.value;
    console.log("Variant selected:", variantValue);

    variantSelect.setAttribute("value", variantValue);

    updateResults(usersAnswersInfo);
    console.log("Results updated with usersAnswersInfo:", usersAnswersInfo);

    saveFilterParams();
    console.log("Filter parameters saved.");
  });
}


// Сортування за прізвищем 
// клік на кнопці змінює порядок сортування
let sortByNameButton = document.querySelector(".sortByName");
if (sortByNameButton) {
  var i = -1
  sortByNameButton.addEventListener("click", function () {
    i = i * (-1)
    let resultsBlock = document.querySelector(".user-results");
    if (!resultsBlock) return;
    console.log(i)
    let resultItems = Array.from(resultsBlock.querySelectorAll(".result-item"));
    if (i == 1) {
      resultItems.sort((a, b) => {
        let nameA = a.querySelector(".result-item__name").textContent.trim().toLowerCase();
        let nameB = b.querySelector(".result-item__name").textContent.trim().toLowerCase();
        return nameA.localeCompare(nameB, 'uk');
      });
    } else {
      resultItems.sort((a, b) => {
        let nameA = a.querySelector(".result-item__name").textContent.trim().toLowerCase();
        let nameB = b.querySelector(".result-item__name").textContent.trim().toLowerCase();
        return nameB.localeCompare(nameA, 'uk');
      });
    }


    // Очищаємо контейнер
    resultsBlock.innerHTML = '';

    // Додаємо відсортовані елементи
    resultItems.forEach(item => {
      resultsBlock.appendChild(item);
    });
  });
}

// Сортування за оцінкою
let sortByMarkButton = document.querySelector(".sortByMark");
if (sortByMarkButton) {
  var i = -1;
  sortByMarkButton.addEventListener("click", function () {
    i = i * (-1);
    let resultsBlock = document.querySelector(".user-results");
    if (!resultsBlock) return;

    let resultItems = Array.from(resultsBlock.querySelectorAll(".result-item"));
    if (i == 1) {
      resultItems.sort((a, b) => {
        let scoreA = a.querySelector(".result-item__score")?.textContent.match(/Оцінка:\s*(\d+)/)[1] || "0";
        //console.log('scoreA ', scoreA)
        let scoreB = b.querySelector(".result-item__score")?.textContent.match(/Оцінка:\s*(\d+)/)[1] || "0"
        //console.log('scoreB ', scoreB)
        return parseFloat(scoreA) - parseFloat(scoreB);
      });
    } else {
      resultItems.sort((a, b) => {
        let scoreA = a.querySelector(".result-item__score")?.textContent.match(/Оцінка:\s*(\d+)/)[1] || "0";
        let scoreB = b.querySelector(".result-item__score")?.textContent.match(/Оцінка:\s*(\d+)/)[1] || "0";
        return parseFloat(scoreB) - parseFloat(scoreA);
      });
    }

    // Очищаємо контейнер
    resultsBlock.innerHTML = '';

    // Додаємо відсортовані елементи 
    resultItems.forEach(item => {
      resultsBlock.appendChild(item);
    });
  });
}
