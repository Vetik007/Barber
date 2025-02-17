const overlayLinks = document.querySelectorAll('.overlay-link'); // получаем доступ ко всем елементам с классом ".overlay-link"
// const body = document.querySelectorAll('.body'); // получаем доступ к тегу "body" для блокирования скрола
const body = document.querySelector('body'); // получаем доступ к тегу "body" для блокирования скрола
const lockPadding = document.querySelectorAll('.lock-padding');

let unlock = true; //чтоб не было дыойных нажатий

const timeout = 800; // задержка которая должна совпадать с transition: transform в css файле

// проверяем есть ли елементы с классом '.overlay-link', если есть перебираем их и записываем в переменную overlayLink
// на елементы с классом '.overlay-link' вешаем событие 'click' и при клике в этих елементах находим атрибут 'href' у которого убираем хеш('#') получая имя элемента по id, которое записывает в переменную overlayName
// елемент id которого равно overlayName записываем в переменную currentOverlay
if (overlayLinks.length > 0) {
  for (let index = 0; index < overlayLinks.length; index++) {
    const overlayLink = overlayLinks[index];
    overlayLink.addEventListener('click', function (e) {
      // const overlayName = overlayLink.getAttribute('href').replace('#', '');
      const overlayName = overlayLink.getAttribute('data-target'); // Используем data-target вместо href
      console.log('overlayName', overlayName);
      const currentOverlay = document.getElementById(overlayName);
      modalOpen(currentOverlay);
      e.preventDefault();
    });
  }
}

// Element.closest() возвращает ближайший родительский элемент (или сам элемент), который соответствует заданному CSS-селектору("#id", ".class", "div" ...) или null, если таковых элементов вообще нет.
// const mоdalCloseIcon = document.querySelector('.close-modal');
const modalCloseIcons = document.querySelectorAll('.modal-close');
if (modalCloseIcons.length > 0) {
  for (let index = 0; index < modalCloseIcons.length; index++) {
    const el = modalCloseIcons[index];
    el.addEventListener('click', function (e) {
      modalClose(el.closest('.backdrop'));
      e.preventDefault();
    });
  }
}

// Функция открытия модального окна
// Проверяем есть ли обьект currentModal и открыт ли он
function modalOpen(currentOverlay) {
  if (currentOverlay && unlock) {
    const modalActive = document.querySelector('.backdrop.open');
    if (modalActive) {
      modalClose(modalActive, false);
    } else {
      bodyLock();
    }
    currentOverlay.classList.add('open');
    currentOverlay.addEventListener('click', function (e) {
      if (!e.target.closest('.modal-content')) {
        modalClose(e.target.closest('.backdrop'));
      }
    });
  }
}

function modalClose(modalActive, doUnlock = true) {
  if (unlock) {
    modalActive.classList.remove('open');
    if (doUnlock) {
      bodyUnLock();
    }
  }
}

//  в фцнкции bodyLock вычисляется ширина полосы прокрутки, которая присваивается body и всем елементам с классом '.lock-padding'.
// это нужно для того чтоб после открытия модального окна и скрытия полосы прокрутки весь контент страницы на сдвигался вправо, а после закрития - влево га ширину скрываемой полосы прокрутки

function bodyLock() {
  // вычисляем разницу между шириной вьюпорта и шириной объекта который находится внутри него, т.е. вычисляем ширину полосы прокрутки
  const lockPaddingValue =
    window.innerWidth -
    document.querySelector('.wrapper-content').offsetWidth +
    'px';

  // запускаем цикл который перебирает все елементы и ищет елементы у которых есть класс '.lock-padding'.
  // всем елементам с классом '.lock-padding' присваивается правый паддинг который равен ранее вычисленной ширине полосы прокрутки и body присваивается класс 'lock'
  if (lockPadding.length > 0) {
    for (let index = 0; index < lockPadding.length; index++) {
      const el = lockPadding[index];
      el.style.paddingRight = lockPaddingValue;
    }
  }

  // елементу body присваиваем правый паддинг, который равен ранее вычисленной ширине полосы прокрутки
  body.style.paddingRight = lockPaddingValue;
  body.classList.add('lock');

  unlock = false;

  setTimeout(function () {
    unlock = true;
  }, timeout);
}

// функция которая раблокирует body и убирает правые паддинги
// запускаем цикл который перебирает все елементы и ищет елементы у которых есть класс '.lock-padding'.
// у всех елементов с классом '.lock-padding' убирается ранее присвоенный правый паддинг который равен ранее вычисленной ширине полосы прокрутки и у body удаляется класс 'lock'
function bodyUnLock() {
  setTimeout(function () {
    if (lockPadding.length > 0) {
      for (let index = 0; index < lockPadding.length; index++) {
        const el = lockPadding[index];
        el.style.paddingRight = '0px';
      }
    }
    body.style.paddingRight = '0px';
    body.classList.remove('lock');
  }, timeout);

  unlock = false;

  setTimeout(function () {
    unlock = true;
  }, timeout);
}
// закриття модалки клавішею ESC
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    const modalActive = document.querySelector('.backdrop.open');
    modalClose(modalActive);
  }
});

(function () {
  if (!Element.prototype.closest) {
    Element.prototype.closest = function (css) {
      var node = this;
      while (node) {
        if (node.matches(css)) return node;
        else node = node.parentElement;
      }
      return null;
    };
  }
})();

(function () {
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector;
  }
})();

// ============= вспливаюча підказка над радіокнопками ===============
document.querySelectorAll('.payment-label').forEach(label => {
  const tooltip = label.querySelector('.tooltip');
  tooltip.textContent = label.getAttribute('data-tooltip');
});

// =========== валідація форми та відправка даних ===================

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('form-modal');
  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const emailInput = document.getElementById('email');
  const paymentInputs = document.querySelectorAll("input[name='money']");
  const submitBtn = document.getElementById('submitBtn');

  function validateForm() {
    let isValid = true;

    // Проверка имени (не пустое)
    if (nameInput.value.trim() === '') {
      nameInput.classList.add('error');
      isValid = false;
    } else {
      nameInput.classList.remove('error');
    }

    // Проверка телефона (простой паттерн)
    const phonePattern = /^\+?[0-9\s\-()]{7,15}$/;
    if (!phonePattern.test(phoneInput.value.trim())) {
      phoneInput.classList.add('error');
      isValid = false;
    } else {
      phoneInput.classList.remove('error');
    }

    // Проверка email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
      emailInput.classList.add('error');
      isValid = false;
    } else {
      emailInput.classList.remove('error');
    }

    // Проверка радиокнопок (должна быть выбрана хотя бы одна)
    let paymentSelected = false;
    paymentInputs.forEach(input => {
      if (input.checked) paymentSelected = true;
    });

    if (!paymentSelected) {
      isValid = false;
    }

    // Активация/деактивация кнопки
    submitBtn.disabled = !isValid;
  }

  // Отслеживание изменений в полях формы
  [nameInput, phoneInput, emailInput, ...paymentInputs].forEach(input => {
    input.addEventListener('input', validateForm);
    input.addEventListener('change', validateForm);
  });

  // Обработка отправки формы
  form.addEventListener('submit', function (event) {
    event.preventDefault(); // Отменяем стандартную отправку формы

    // Сбор данных
    const formData = {
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      email: emailInput.value.trim(),
      paymentMethod: [...paymentInputs].find(input => input.checked)?.value,
    };

    console.log('Отправляем в базу:', formData);

    // ❗ Здесь можно отправить `formData` в базу (AJAX / fetch)
    // fetch('/save-data', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData)
    // }).then(response => response.json()).then(data => console.log(data));

    alert('Форма успешно отправлена!');
    form.reset();
    validateForm(); // Перепроверяем после очистки
    // setTimeout(validateForm, 0);
  });
});
