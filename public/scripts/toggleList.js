const UserMenu = function (element) {
  this.root = element;
  this.btnToggle = this.root.querySelectorAll('button');
  this.menuList = this.root.querySelectorAll('.userMenu');

  // Adding click events to all buttons and adding the corresponding list with it
  for (let i = 0; i < this.btnToggle.length; i++) {
    this.btnToggle[i].addEventListener('click', (element) => {
      // element.preventDefault(); // Prevent the default action
      this.menuToggle(this.menuList[i]);
    });
  }
};

UserMenu.prototype.menuToggle = element => {
  element.classList.toggle('hide');
};

const userTableRoot = document.querySelector('main')
const ownTableMenu = new UserMenu(userTableRoot);
