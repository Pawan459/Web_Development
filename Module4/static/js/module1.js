(function() {
  renderInit();

  const [btnPlay] = document.getElementsByClassName("audio-btn"),
    [eleLetterCntr] = document.getElementsByClassName("letter__text"),
    baseUrl = "../static/images/",
    animRightDur = 500,
    animWrongDur = 1000,
    eleAudio = document.getElementById("player"),
    [eleVolIcon] = $(".vol-btn__icon"),
    [eleLetterUpper] = $(".letter__text-up"),
    [eleLetterLower] = $(".letter__text-low"),
    eleLetterImage = document.getElementById("letter-img");
  let currentCharCode = 97;

  function onDocKeyPress(event) {
    const currentChar = String.fromCharCode(currentCharCode);
    const pressedKey = event.key.toLowerCase();

    if (currentChar === pressedKey) {
      animRight();
      setTimeout(animRight, animRightDur);
      currentCharCode++;
      setTimeout(renderPanel, animRightDur);
    } else {
      animWrong();
      setTimeout(animWrong, animWrongDur);
    }
  }
  function toggleVolIconClasses() {
    eleVolIcon.classList.toggle("fa-volume-up");
    eleVolIcon.classList.toggle("fa-pause");
  }
  function onPlayClick() {
    if (eleAudio.paused) {
      eleAudio.play();
    } else {
      eleAudio.pause();
    }
    toggleVolIconClasses();
  }
  animRight = () => {
    eleLetterCntr.classList.toggle("rgt");
  };
  animWrong = () => {
    eleLetterCntr.classList.toggle("wrg");
  };
  renderPanel = () => {
    if (currentCharCode > 122) {
      renderSuccessPanel();
      return;
    }
    const currChar = String.fromCharCode(currentCharCode);
    eleLetterUpper.innerHTML = currChar.toUpperCase();
    eleLetterLower.innerHTML = currChar;

    const newImgUrl = `${baseUrl}${currChar}.png`;
    eleLetterImage.setAttribute("src", newImgUrl);
    eleLetterImage.setAttribute("alt", `image of ${currChar}`);
  };

  renderSuccessPanel = () => {
    const eleSuccess = `
    <div class="success">
        <div class="star">
            <span> <i class="fa fa-star" style="font-size:48px;"></i></span>
            <span> <i class="fa fa-star" style="font-size:64px;"></i></span>
            <span> <i class="fa fa-star" style="font-size:48px;"></i></span>
            <p class="success-txt">Congratulations</p>
        </div>
    </div>
    <div class="col-sm">
        <button type="button" class="btn btn-primary btn-lg btn-block next-stage-btn">Go to next stage</button>
    </div>`;

    document.getElementById("module1-panel").innerHTML = eleSuccess;
  };

  function renderInit() {
    const elePanel = `<div class="jumbotron bg-light" id="module1-panel">
      <div class="row justify-content-center img-row">
          <div class="col-sm-5 bg-white letter">
              <span class="letter__text">
                  <span class="letter__text-up" value="97" >A</span><span class="letter__text-low">a</span>
              </span>
          </div>
          <div class="col-sm-5 offset-sm-1 bg-white letter-img">
              <img id= "letter-img" src="../static/images/a.png" alt="image of apple" height="150" width="150" ></img>
          </div>
      </div>
      <div class="row">
          <div class="col-sm">
              <button type="button" class="btn btn-primary btn-lg btn-block next-stage-btn" disabled>Go to next stage</button>
          </div>
      </div>
  </div>
  <audio id="player">
    <source src='http://hi5.1980s.fm/;' type='audio/mpeg'/>
  </audio>`;

    const eleRightPanel = `<div class="row justify-content-center avatar-row">
    <div class="col-sm-3 align-self-center">
        <div class="newtooltip">
            <div class="audio-btn">
                <span> <i class="fa fa-volume-up vol-btn__icon" style="font-size:15px;"></i></span>
            </div>
            <img src="../static/images/avatar.png" alt="Avatar" class="avatar">
            <span class="tooltiptext">Tooltip text</span>
        </div>
    </div>
  </div> `;

    document.getElementById("center-panel").innerHTML = elePanel;
    document.getElementById("right-panel").innerHTML = eleRightPanel;
  }

  btnPlay.onclick = onPlayClick;
  document.onkeypress = onDocKeyPress;
})();
// config.js
//
//
// variable let/const/string
// function init/handle/redres
// bindings
//init calls
