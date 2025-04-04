import * as impPopups from "./components/popups.js";
import * as importConfig from "./dev/config.js";
import * as impHttp from "./http/api-router.js";
import * as impSubject200 from "./convert200.js";

adminLogin();

async function adminLogin() {
  let loginForm = document.querySelector(".admin-page__login");
  if (!loginForm) return;
  let authResponse = await impHttp.isAuth();
  if (authResponse.status == 200) {
    loginForm.remove();
    adminPage();
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

const fillTestBlocks = (userBlock, tests, correctTests = []) => {
  const testBlocks = userBlock.querySelectorAll(
    ".admin-page__user-current-test-progress"
  );
  testBlocks.forEach((testBlock) => {
    const testId = testBlock.getAttribute("test");
    const testData = tests.find((test) => test.testId == testId);
    //console.log(testData);
    testData.answers.forEach((answer, index) => {
      let correctAnswerArr = correctTests[index];

      let isAnswerCorrect = answer.answer.every((item, index) => {
        return item == correctAnswerArr[index];
      });

      testBlock.innerHTML += `
        <div class="admin-page__user-current-test-progress-item ${answer.submitted ? "passed" : ""
        } ${!isAnswerCorrect && answer.submitted ? "answer_wrong-with-bg" : ""
        }">${answer.question + 1}</div>
      `;
    });
  });
};

const appendUser = async (name, tests, testsArray, user) => {
  const users = document.querySelector(".admin-page__users");
  let userBlock = document.createElement("div");
  userBlock.classList.add("admin-page__users-user");
  userBlock.innerHTML =
    `
  <div class="admin-page__users-info">
    <div class="result-item__name_block">
      <input type='checkbox' class='delete-check-box test-check-box' >
      <h2 class="result-item__name admin-page__name_collapse">${name}</h2>
    </div>
    
    <div>    
    <button class="test-footer__button result-item__info_block"></button>   
    <button class="test-footer__button admin-page__delete result-item__name_btn_remove ">Видалити</button>
    </div>
  </div>
  `;

  tests.sort((a, b) => {
    return a.name.localeCompare(b.name, 'uk');
  });

  for (const test of tests) {
    let testBlock = document.createElement("div");
    testBlock.classList.add("admin-page__users-test");
    testBlock.innerHTML = `
      <h3>${test.name}<span class="admin-page__user-current-test-progress-precentage"></span></h3>    
      <div class="admin-page__user-current-test-progress" test="${test.testId}"></div>        
    `;
    let correctTests = await getCorrectAnswer(test, testsArray);
    fillTestBlocks(testBlock, tests, correctTests);
    userBlock.appendChild(testBlock);
  }

  //згорнути/розгорнути інформацію про користувача
  let collapseButton = userBlock.querySelector(".admin-page__name_collapse")
  //let collapseButton = userBlock.querySelector(".result-item__name")

  //console.log(collapseButton);
  //додати клік на кнопку
  collapseButton.addEventListener("click", function () {
    let userBlock = this.closest(".admin-page__users-user");
    if (!userBlock) return;

    let testBlocks = userBlock.querySelectorAll(".admin-page__users-test");
    testBlocks.forEach(testBlock => testBlock.classList.toggle("collapsed"));

    let info = userBlock.querySelector(".result-item__info_block");
    if (!info) return;
    
    info.innerHTML = ""; // Якщо треба очищати перед оновленням

    let spanResult = userBlock.querySelectorAll(".result-span");
    spanResult.forEach(span => {
        info.prepend(span.cloneNode(true)); // Клонуємо, щоб зберегти оригінал
    });
});


  //Блок видалення користувача  
  let removeButton = userBlock.querySelector(".result-item__name_btn_remove");
  removeButton.addEventListener("click", async () => {
    let main = document.querySelector("main");
    let popupText = `
        Видалити користувача <h2> ${name}?</h2>
        `;
    let popupObj = impPopups.yesNoPopup(popupText);
    main.appendChild(popupObj.popup);
    let yesButton = popupObj.yesButton;
    yesButton.addEventListener("click", async function (e) {
      e.preventDefault();
      popupObj.popup.remove();
      let response = await impHttp.removeCurrentPassingUserByEmail(user.email);
      if (response.status == 200) {
        //alert("Видалено користувача! 😎");
        userBlock.remove();
      } else {
        alert("Помилка видалення відповіді!");
      }
    });
    let noButton = popupObj.noButton;
    noButton.addEventListener("click", async function (e) {
      e.preventDefault();
      popupObj.popup.remove();
    });
  });
  users.appendChild(userBlock);
};

const removeOldUsers = () => {
  const users = document.querySelector(".admin-page__users");
  users.innerHTML = "";
};

const initRefreshButton = () => {
  const refreshButton = document.querySelector(".admin-page__refresh-button");
  refreshButton.addEventListener("click", () => adminPage());
};

const appendData = async () => {
  const { data: currentPassingUsers } =
    await impHttp.getAllCurrentPassingUsers();

  // шось працює а як це не важливо
  let testIsd = Array.from(
    new Set(
      currentPassingUsers
        .map((item) => {
          return item.tests.map((item) => {
            return item.testId;
          });
        })
        .flat()
    )
  );

  let correctTests = await getTestsInformation(testIsd);

  removeOldUsers();

  currentPassingUsers.sort((a, b) => {
    return a.name.localeCompare(b.name, 'uk');
  });

  currentPassingUsers.map(async (user) => {
    await appendUser(user.name, user.tests, correctTests, user);
  });

  if (currentPassingUsers.length == 0) {
    const users = document.querySelector(".admin-page__users");
    users.innerHTML = "<h4>Зараз немає користувачів які проходять тести</h4>";
  }
};

const adminPage = async () => {
  await appendData();
  initTimer();
  countH2()
};

let timer = 30
// в admin-page__timer-button додати таймер що відраховує час до оновлення сторінки
const initTimer = () => {
  let timerButton = document.querySelector(".admin-page__timer-button");
  if (!timerButton) return;
  timerButton.textContent = timer;
  setInterval(() => {
    timerButton.textContent = timer;
    timer--;
    if (timer == 0) {
      timer = 30;
    }
  }, 1000);
};

const initRefreshing = () => {
  setInterval(() => {
    adminPage();      
    //пауза на 2 сек і закриття всіх користувачів
    setTimeout(() => {
      let collapseButton = document.querySelectorAll(".admin-page__name_collapse");
      if (!collapseButton) return;
      collapseUsers()
    }, 2000);
  }, timer * 1000);
};

initRefreshButton();
initRefreshing();

//коли завантажиться сторінка підрахувати кількість h2 елементів на сторінці
function countH2() {
  let h2 = document.querySelectorAll("h2");
  //console.log(h2.length);
  document.getElementsByClassName("admin-page__count-button")[0].textContent = h2.length
  return h2.length;
}

//при кліку на кнопку "Видалити" видалити користувача
async function getTestsInformation(arr) {
  let testsInfoResponse = await impHttp.getAllTestsFromDB(arr);
  if (testsInfoResponse.status != 200) {
    return alert("Помилка отримання даних" + testsInfoResponse.data.message);
  }
  return testsInfoResponse.data;
}

async function getCorrectAnswer(test, testsInfo) {
  let currentTest = testsInfo?.filter((obj) => obj.testId === test.testId);
  let currentTestBody = JSON.parse(currentTest[0].questions);

  if (!currentTestBody) {
    alert("error line 130");
  }

  let corectAnswers = currentTestBody.map((item) => {
    return item.correctAnswers;
  });

  return corectAnswers;
}


//обрати всі чекбокси .delete-check-box для видалення користувачів 
const selectAllButton = document.querySelector('.selectAll');
if (selectAllButton) {
  selectAllButton.addEventListener('click', function () {
    const checkboxes = document.querySelectorAll('.delete-check-box');
    checkboxes.forEach(function (checkbox) {
      checkbox.checked = true;
    });
  });
}

// delete button
const deleteSelectedUsersButton = document.querySelector('.delete-current-passing-users');

// Add event listener to the delete button
deleteSelectedUsersButton.addEventListener('click', function () {

  const selectedUsers = []
  // Отримання імен всіх обраних користувачів
  const selectedItems = document.querySelectorAll('.delete-check-box:checked');
  selectedItems.forEach(function (checkbox) {
    const resultItem = checkbox.closest('.admin-page__users-user');
    if (resultItem) {
      selectedUsers.push(resultItem.querySelector('h2').innerText)
    }
  });

  //Вивести дані масиву selectedUsers кожен за новим рядком
  let userList = selectedUsers.map(user => `<div style = "float:left">${user}</div>`).join('');

  let popupText = `
      <h2>Видалити обраних користувачів?</h2>
      <h3 style = "height:300px; overflow:auto">${userList}</h3>
      `;

  let popupObj = impPopups.yesNoPopup(popupText);

  let main = document.querySelector("main");
  main.appendChild(popupObj.popup);
  let yesButton = popupObj.yesButton;
  yesButton.addEventListener("click", async function (e) {
    e.preventDefault();
    popupObj.popup.remove();

    selectedItems.forEach(function (checkbox) {
      const resultItem = checkbox.closest('.admin-page__users-user');
      if (resultItem) {
        // Trigger the delete action for the selected result item
        resultItem.querySelector('.result-item__name_btn_remove').click();

        // Wait for the "Yes" button to appear, and then click it
        setTimeout(function () {
          const yesButton = document.querySelector('button.buttons__button-yes');
          if (yesButton) {
            yesButton.click();
          }
        }, 1000); // Adjust the timeout if necessary to match the UI behavior
      }
    });

  });
  let noButton = popupObj.noButton;
  noButton.addEventListener("click", async function (e) {
    e.preventDefault();
    popupObj.popup.remove();
  });


});

//
//кнопка згорнути/розгорнути всіх користувачів
const collapseAllButton = document.querySelector('.admin-page__collapse-all-button');

if (collapseAllButton) {
  collapseAllButton.addEventListener('click', function () {
    //Змінювати напис кнопки при кліку Згорнути/Розгорнути
    let text = this.textContent;
    this.textContent = text === "Згорнути всіх" ? "Розгорнути всіх" : "Згорнути всіх";
    collapseUsers();
  });
}

//згорнути/розгорнути всіх користувачів
function collapseUsers() {
  let collapseButton = document.querySelectorAll(".admin-page__name_collapse");
  if (!collapseButton) return;
  collapseButton.forEach(button => {
    button.click();
  });
}

