// 이미지 정보 객체 배열 (json format) - 실제 개발에서는 서버에서 받아온 데이터 형식으로 사용
const filterItems = [
  { dataFilter: 'bag', src: 'bag-1.jpg' },
  { dataFilter: 'camera', src: 'camera-1.jpg' },
  { dataFilter: 'camera', src: 'camera-2.jpg' },
  { dataFilter: 'headphone', src: 'headphone-1.jpg' },
  { dataFilter: 'headphone', src: 'headphone-2.jpg' },
  { dataFilter: 'shoe', src: 'shoe-1.jpg' },
  { dataFilter: 'shoe', src: 'shoe-2.jpg' },
  { dataFilter: 'watch', src: 'watch-1.jpg' },
];

// 전체 이미지를 감싸는 요소 저장
const imageWrapper = document.querySelector('.filter-images');

// json 객체 데이터 배열을 forEach 메서드로 순회 - 배열 요소 각각을 분리 - 분리된 각각의 데이터는 item 파라미터에 전달
filterItems.forEach((item) => {
  // 각각의 이미지 요소 생성 - DOM(Document Object Model : html 문서의 요소들) 생성
  const itemElmt = `
        <div class="filter-image show" data-filter="${item.dataFilter}">
          <span>
            <img src="images/${item.src}" alt="">
          </span>
        </div>
  `;

  // 생성된 이미지 요소를 감싸는 요소에 추가
  imageWrapper.insertAdjacentHTML('beforeend', itemElmt);
});

// DOM 요소들 변수 저장
const btns = document.querySelectorAll('.filter-btns button'); // 버튼 요소들 저장
const images = document.querySelectorAll('.filter-image'); // 이미지 요소들 저장
const lightBox = document.querySelector('.light-box'); // 라이트 박스 요소 저장
const overlay = document.querySelector('.overlay'); // 오버레이 요소 저장
const closeBtn = document.querySelector('.ri-close-line'); // x 버튼 요소 저장

// 라이트 박스 활성화 함수 - 클릭한 이미즈를 thisElmt 파라미터로 전달
const activateLightBox = (thisElmt) => {
  const thisElmtSrc = thisElmt.querySelector('img').getAttribute('src'); // 클릭한 이미지의 src 속성값 저장
  const thisElmtDataFilter = thisElmt.getAttribute('data-filter'); // 클릭한 이미지의 data-filter 속성값 저장

  const firstLetter = thisElmtDataFilter.charAt(0).toUpperCase(); // 첫 번째 글자를 선택하여 대분자로 변환
  const remainLetters = thisElmtDataFilter.slice(1); // 두 번째 글자부터 나머지 글자 전체를 선택

  const cateElmt = document.querySelector('.title p'); // 카테고리 문자 요소(p) 저장

  cateElmt.textContent = firstLetter + remainLetters; // 첫 번째 대문자 + 나머지 글자를 텍스트로 지정

  // 함수가 실행되면 클릭된 모든 이미지 요소의 active 클래스 삭제
  images.forEach((img) => img.classList.remove('active'));
  // 클릭한 대상 이미지 요소에 active 클래스 추가
  thisElmt.classList.add('active');

  // 라이트 박스가 활성화 될 때 클릭된 이미지 요소의 src 속성 값을 읽어 라이트 박스 이미지 src 속성값으로 전달
  lightBox.querySelector('img').setAttribute('src', thisElmtSrc);

  lightBox.classList.add('show'); // 라이트 박스에 show 클래스를 추가하여 활성화
  overlay.classList.add('show'); // 오버레이에 show 클래스를 추가하여 활성화
};

// 이미지 요소들을 순회하여 각각을 클릭했을 때 activeLightBox 함수 실행 : 클릭한 대상 요소를 파라미터로 전달
images.forEach((img) => {
  img.addEventListener('click', function () {
    activateLightBox(this);
  });
});

// 이미지 요소 배열을 순회한다. 첫번째 파라미터는 이미지 요소 배열, 두번째 파라미터는 boolean 값 - true일 경우 ? 뒤에 : 을 기준으로 앞에 로직이 적용되고, false 일 경우 뒤에 로직이 적용된다.
function showAndHide(images, isShow) {
  images.forEach((image) => {
    image.classList.add(isShow ? 'show' : 'hide');
    image.classList.remove(isShow ? 'hide' : 'show');
  });
}

// 탭 버튼을 클릭했을 때 실행되는 함수
function showItems(thisItem) {
  // 탭 버튼을 클릭했을 때 클릭된 탭의 data-filter 속성값 저장
  const thisCategory = thisItem.getAttribute('data-filter');

  showAndHide(images, false); // images array add hide remove show

  if (thisCategory === 'all') {
    // 클릭한 요소의 속성값이 all일 때
    showAndHide(images, true); // images array add show remove hide
  }

  // 클릭한 탭 버튼 요소의 data-filter 속성값과 이미지 요소의 data-filter 속성값이 일치하는 것만 필터링
  const thisImage = Array.from(images).filter(
    // Array.from() : 유사배열(NodeList, HTMLCollection)을 정식 배열로 전환
    (image) => image.getAttribute('data-filter') === thisCategory
  );

  showAndHide(thisImage, true); // images array add show remove hide
}

// 탭 버튼 배열을 순회
btns.forEach((btn) => {
  // 각각의 탭 버튼을 클릭했을 때
  btn.addEventListener('click', function () {
    // 모든 버튼 요소의 active 클래스 제거
    btns.forEach((btn) => btn.classList.remove('active'));
    // 클릭한 대상 요소에만 active 클래스 추가
    this.classList.add('active');

    showAndHide(images, false); // images array add show remove hide

    // 이미지 요소들이 재배치 될 때 0.1초 뒤에 showItems 함수 실행
    setTimeout(() => {
      showItems(this);
    }, 100);
  });
});

// 라이트 박스 닫는 함수
function closeLightBox() {
  lightBox.classList.remove('show'); // 라이트 박스 자체를 없앤다.
  overlay.classList.remove('show'); // 배경 오버레이를 없앤다.
}

// 이벤트 실행 함수를 전달할 때 ()를 붙이지 않는다.
closeBtn.addEventListener('click', closeLightBox); // x 버튼을 클릭했을 때 함수 실행
overlay.addEventListener('click', closeLightBox); // 배경 오버레이를 클릭했을 때 함수 실행

// getAttribute() : https://urliveblogger.blogspot.com/2021/01/js-getAttribute.html
// setAttribute() : https://urliveblogger.blogspot.com/2021/01/js-setAttribute.html
// filter() : https://velog.io/@haleyjun/JavaScript-filter-%EC%82%AC%EC%9A%A9%EB%B2%95
// method : 어떠한 객체의 맴버가 함수일 경우 메서드라고 부른다.
// Array.from() : 유사배열(NodeList, HTMLCollection)을 정식 배열로 전환
// setTimeout() : https://www.freecodecamp.org/korean/news/how-to-set-a-timer-in-javascript/

// 첫번째 파라미터 : 함수 - 실행할 코드, 두번째 파라미터 : 숫자 - 시간(밀리초) == 밀리초 단위 시간 이후 함수 실행
// setTimeout(function () {
//   alert('Hello World');
// }, 1000);

// setInterval() : https://ko.javascript.info/settimeout-setinterval
// 2초 간격으로 메시지를 보여줌
// 변수에 값을 저장하게 되면, 변수를 이용하여 일정 시간 이후 실행을 정지시킬 수 있다. (clearInterval(timerId))
// const timerId = setInterval(() => console.log('째깍'), 1000);

// 5초 후에 정지
// setTimeout(() => {
//   clearInterval(timerId);
// }, 5000);

// const a = 1;
// if (a === 1) {
//   console.log(true);
// } else {
//   console.log(false);
// }

// 삼항 연산자
// a === 1 ? console.log(true) : console.log(false);
