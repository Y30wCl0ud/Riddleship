// Sources for AJAX
// Titus Worm: https://github.com/CMDA/backend-example
// http://youmightnotneedjquery.com/
const togglePopUp = document.querySelectorAll('[data-id]');
const popUp = document.querySelector('#popUp');
const popUpLinks = document.querySelectorAll('#popUp button');
const banText = document.querySelector('#popUp p');

for (let i = 0; i < togglePopUp.length; i++) {
  togglePopUp[i].addEventListener('click', getData); //
}

popUpLinks[0].addEventListener('click', hidePopUp); // add event to the cancel btn to hide the popup

function hidePopUp(event) {
  popUp.classList.add('hide');
}

function getData(event) {
  event.preventDefault();

  const node = event.target;
  const request = new XMLHttpRequest();

  request.open('GET', '/api/' + node.dataset.id , true);
  request.onload = onload;
  request.send();

  function onload() {
    if (request.status != 200) {
      // We reached our target server, but it returned an error
      console.log('sorry mate');
    } else {
      let userData = JSON.parse(request.responseText);

      // checks whether user
      if (userData[0].banned === 1) {
        popUpLinks[1].innerHTML = 'unban';
        banText.innerHTML = `Are you sure that you want to unban  ${userData[0].name}?`;
      } else {
        popUpLinks[1].innerHTML = 'ban';
        banText.innerHTML = `Are you sure that you want to ban  ${userData[0].name}?`;
      }

      popUp.classList.remove('hide'); // show the pop up after assigning the values

      popUpLinks[1].addEventListener('click', function() {
        banDecision(userData[0]);
      });
    }
  }
}

function banDecision(userBan) {
  const dataId = document.querySelector(`[data-id="${userBan.userID}"]`); // to change the button text
  const request = new XMLHttpRequest();

  // sends a post request to ban user if not banned else unban
  if (userBan.banned) {
    request.open('POST', '/users/unban/' + userBan.userID, true);
    dataId.innerHTML = 'ban user';
  } else {
    request.open('POST', '/users/ban/' + userBan.userID, true);
    dataId.innerHTML = 'unban user';
  }
  request.onload = onload;
  request.send();

  function onload() {
    if (request.status != 200) {
      console.log('sorry mate');
    }
  }

  hidePopUp(); // hide the popup after banning/unbanning
}
