// Source: http://javabeat.net/javascript-snippets-back-button/
const no-js = document.querySelectorAll('.no-js');
const backBtn = document.querySelector('[data-back]');

for (let i = 0; i < no-js; i++) {
  no.js[i].classList.remove('no-js');
};

backBtn.addEventListener('click', () => {
  history.go(-1);
});
