// 변수, 상수 만들기
// 필요한 데이터 // 윈도우 객체 가져오기
const list = document.getElementById("list");
const createBtn = document.getElementById("create-btn");

// 필요한 데이터를 가지고 있을 부분 (변경이 되어야 하므로 let으로 정의)
let todos = [];

// 이벤트 리스너 항수 등록하기
// 1. 직접 등록
// 2. property에 등록
// 3. addEventListener 메소드 사용

createBtn.addEventListener("click", createNewTodo);

function createNewTodo() {
  // 새로운 아이템 객체 생성
  // todos에 객체를 넣어줘야 하므로

  const item = {
    id: new Date().getTime(),
    text: "",
    complete: false,
  };

  // 배열 처음에 새로운 아이템을 추가
  todos.unshift(item);

  // 요소 생성하기
  const { itemEl, inputEl, editBtnEl, removeBtnEl } = createTodoElement(item);

  // 리스트 요소 안에 방금 생성한 아이템 요소 추가 (가장 앞에)
  list.prepend(itemEl);

  inputEl.removeAttribute("disabled");
  inputEl.focus();
  saveToLocalStorage();
}

function createTodoElement(item) {
  const itemEl = document.createElement("div");
  itemEl.classList.add("item");

  const checkboxEl = document.createElement("input");
  checkboxEl.type = "checkbox";
  checkboxEl.checked = item.complete; // true ot false

  if (item.complete) {
    // true일 때 클래스 명에 comlete 추가
    itemEl.classList.add("complete");
  }

  const inputEl = document.createElement("input");
  inputEl.type = "text";
  inputEl.value = item.text; // 리프레쉬 되어도 값이 남아 있게 함
  inputEl.setAttribute("disabled", ""); // disable는 타이핑을 막는다.

  // action button들 추가
  // 여기부터
  const actionsEl = document.createElement("div");
  actionsEl.classList.add("actions");

  const editBtnEl = document.createElement("button");
  editBtnEl.classList.add("material-icons");
  editBtnEl.innerText = "edit";

  const removeBtnEl = document.createElement("button");
  removeBtnEl.classList.add("material-icons", "remove-btn");
  removeBtnEl.innerText = "remove_circles"; // 구글폰트 아이콘을 가져와 사용 -> index.html에 링크 경로 추가
  // 여기까지

  // 체크박스를 클릭했을 때 발생하는 이벤트
  // 한번의 동작을 등록해야한다.
  // 따라서 생성될 때 이벤트리스너 함수를 등록해줘야 한다.
  // ***이벤트 종류 다시 공부할 것***
  checkboxEl.addEventListener("change", () => {
    item.complete = checkboxEl.checked;

    if (item.complete) {
      itemEl.classList.add("complete"); //체크 되었을 때 (눌렀을 때)
    } else {
      itemEl.classList.remove("complete"); // 체크가 풀렸을 때
    }

    saveToLocalStorage();
  });

  // input 이벤트가 발생했을 때 해줘야 하는 것
  inputEl.addEventListener("blur", () => {
    inputEl.setAttribute("disabled", "");
    saveToLocalStorage(); // 이벤트가 발생하면 한번에 처리
  });

  inputEl.addEventListener("input", () => {
    item.text = inputEl.value; // value 값을 타이핑 하는 값으로 바꿔준다.
  });

  // 편집 버튼 활성화
  editBtnEl.addEventListener("click", () => {
    inputEl.removeAttribute("disabled");
    inputEl.focus();
  });

  // 지우는 버튼 활성화
  removeBtnEl.addEventListener("click", () => {
    // 요소를 지우기 전에 먼저 데이터 부분을 지운다. ==> filter 메소드가 효과적
    // 배열을 하나씩 순회하여 클릭한 요소의 아이디와 "다른 것"만 남기고 "같은 것"만 지운다.
    // 그리고 걸러내고 남은 것은 다시 todos 배열에 넣어준다.
    // 결국 제거할 것만 걸러낸 것
    todos = todos.filter((t) => t.id !== item.id);
    // itemEl 요소(브라우저 표시)도 지워준다.
    itemEl.remove();
    saveToLocalStorage();
    // 리프레쉬하면 날아가지 않도록 DB 저장
    // 로컬 스토리지 사용
  });

  // 만든 것들을 브라우저에 나오도록 하기 위해 각 요소에 추가
  actionsEl.append(editBtnEl);
  actionsEl.append(removeBtnEl);

  itemEl.append(checkboxEl);
  itemEl.append(inputEl);
  itemEl.append(actionsEl);
  // 추가는 여기까지

  // 요소들을 다 리턴해준다.
  // createTodoElement 할 때 리턴한 요소들을 사용할 수 있게됨
  // '요소 생성하기' 참고
  return { itemEl, inputEl, editBtnEl, removeBtnEl };
}

// 리프레쉬하면 수정 정보가 날아가지 않도록 DB 저장
function saveToLocalStorage() {
  const data = JSON.stringify(todos); // string화 해서

  localStorage.setItem("my_todos", data); // 넣어준다.
}

// 데이터를 로드한다.
function loadFromLocalStorage() {
  const data = localStorage.getItem("my_todos");
  // setItem으로 데이터를 넣어니 getItem으로 가져온다.

  if (data) {
    todos = JSON.parse(data);
    // 가져오려는 데이터가 있으면 변경
  }
}
// 위의 loadFromLocalStorage()는 디스플레이를 표시할 때 호출하여 데이터를 가져오고
// 이를 반복문을 사용하여 디스플레이에 표시한다.
function displayTodos() {
  loadFromLocalStorage();
  for (let i = 0; i < todos.length; i++) {
    const item = todos[i];
    const { itemEl } = createTodoElement(item);
    // 리스트 요소 안에 아이템 요소 추가 (가장 앞에)
    list.append(itemEl);
  }
}

// 디스플레이 표시 함수 호출
displayTodos();
