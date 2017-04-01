let UserMenu = function(element) {
  this.root = element;
  this.btnToggle = this.root.querySelectorAll('button');
  this.menuList = this.root.querySelectorAll('.userMenu');

  // adding click events to all buttons and adding the corresponding list with it
  for (let i = 0; i < this.btnToggle.length; i++) {
    this.btnToggle[i].addEventListener('click', (element) => {
      element.preventDefault(); // prevent the default action
      this.menuToggle(this.menuList[i]);
    });
  };
};

UserMenu.prototype.menuToggle = (element) => {
  element.classList.toggle('hide');
};

let userMenuRoot = document.querySelector('.contentList');
let ownUserMenu = new UserMenu(userMenuRoot);
