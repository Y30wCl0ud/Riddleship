// Source: http://javabeat.net/javascript-snippets-back-button/
const backBtn = document.querySelector('[data-back]');

backBtn.classList.remove('noJs');
backBtn.addEventListener('click', () => {
  history.go(-1);
});
