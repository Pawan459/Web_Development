(function() {
  const domainName = "15.206.80.44";
  const proxyUrl = "https://cors-anywhere.herokuapp.com/";
  const startQuestionUrl = "http://15.206.80.44/api/v2/maths/4/0/get_data";
  const playbtn = document.getElementById("playbtn");

  const utterance = new SpeechSynthesisUtterance();
  utterance.lang = "en-UK";
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.voice = speechSynthesis.getVoices()[0];

  let questionLayout;
  let question = {};
  let wordIndex = 1;
  let currentSpeakIndex = 0;

  renderInit();
  let questionId, questionAudioList;
  const inputResult = document.getElementById("result-input");
  const wordSpans = document.getElementsByClassName("word_span");

  function renderInit() {
    const eleRightPanel = `<div class="row justify-content-center avatar-row">
        <div class="col-sm-3 align-self-center">
            <div class="newtooltip">
                <div class="audio-btn">
                    <span> <i id="playbtn" class="fa fa-volume-up vol-btn__icon" style="font-size:15px;"></i></span>
                </div>
                <img src="../static/images/avatar.png" alt="Avatar" class="avatar">
                <span class="tooltiptext">Tooltip text</span>
            </div>
        </div>
    </div> 
    <div class="row">
        <div class="col-md-8 offset-md-3">
            <button id="formatQuesBtn"> Format Question </button>
        </div>
    </div>`;

    document.getElementById("right-panel").innerHTML = eleRightPanel;
    getQuestionData(startQuestionUrl)
      .then(data => {
        const randomNumber = Math.floor(Math.random() * Math.floor(2));
        questionLayout = randomNumber == 0 ? "horizontal" : "vertical";

        renderQuestion(data, questionLayout);
      })
      .then(() => {
        if (question.larger_number.value < 8) {
          renderImages();
        }
      });
  }

  function onResultInputChange(e) {
    const [btnNext] = document.getElementsByClassName("mod2-next-btn");
    btnNext.disabled = e.target.value.length > 0 ? false : true;
    document.getElementById("input-error-msg").classList.add("hide");
  }

  function renderQuestion(question, layout) {
    if (layout == "horizontal") {
      renderHorizontalQuestion(question);
      questionLayout = "horizontal";
    } else {
      renderVerticalQuestion(question);
      questionLayout = "vertical";
    }
  }
  function renderImages(url) {
    let el = document.createElement("img");

    el.src = url || "../static/images/fruit.jpg";
    el.setAttribute("alt", "fruit-img");
    el.setAttribute("width", "20");
    el.setAttribute("height", "20");

    const [eleImgContainerLarge] = document.getElementsByClassName(
      "img-container-large"
    );
    const [eleImgContainerSmall] = document.getElementsByClassName(
      "img-container-small"
    );

    const largeNumber = question.larger_number.value;
    const smallerNumber = question.smaller_number.value;

    for (let i = 1; i <= 3; i++) {
      eleImgContainerLarge.appendChild(el.cloneNode(true));
    }
    for (let i = 1; i <= 3; i++) {
      eleImgContainerSmall.appendChild(el.cloneNode(true));
    }
  }
  function renderHorizontalQuestion(question) {
    const eleCenterPanel = `
    <div class="row">
        <div class="col-md-4 text-center">
            <div class="img-container-large">
               
            </div>
            <h1 class="word_span">${question.larger_number.value}</h1>
            <div><span>(</span>${question.larger_number.spelling}<span>)</span></div>
        </div>
        <div class="col-md-1 text-center"><h1 class="word_span" id="operator">${question.operator.symbol}</h1></div>
        <div class="col-md-4 text-center">
            <div class="img-container-small">
               
            </div>
            <h1 class="word_span">${question.smaller_number.value}</h1>
            <div><span>(</span>${question.smaller_number.spelling}<span>)</span></div>
        </div>
        <div class="col-md-1 text-center"><h1 class="word_span">=</h1></div>
        <div class="col-md-2 .d-flex justify-content-center">
            <input type="text" id="result-input" class="form-control input-lg"/>
            <span id="input-error-msg" class="hide"> Incorrect Answer </span>
            
        </div>
    </div>
    <div class="row justify-content-center mt-5">
        <button type="button" class="btn btn-primary btn-lg mod2-next-btn" disabled>Go to next stage</button>
    </div>`;

    document.getElementById("center-panel").innerHTML = eleCenterPanel;
  }

  function renderVerticalQuestion(question) {
    const eleCenterPanel = `
    <div class="row ml-4">
        <div class="col-md-12 mb-1">
            <div class="row">
                <div class="col-md-4 text-right d-flex justify-content-end">
                    <div class="img-container-large d-flex align-items-center mr-5">
                    </div>
                    <h1 class="word_span" style="letter-spacing:16px">${question.larger_number.value}</h1>
                </div>
                <div class="col-md-8 d-flex align-items-center h3 font-weight-normal"><span>(</span>${question.larger_number.spelling}<span>)</span></div>
            </div>
        </div>
        <div class="col-md-12 mb-1">
            <div class="row">
                <div class="col-md-4 text-right d-flex justify-content-end">
                    <div class="img-container-small d-flex align-items-center mr-3">
                    </div>
                    <h1 style="letter-spacing:16px"><span class="word_span">${question.operator.symbol}</span><span class="word_span">${question.smaller_number.value}</span></h1>
                </div>
                <div class="col-md-8 d-flex align-items-center h3 font-weight-normal"><span>(</span>${question.smaller_number.spelling}<span>)</span></div>
            </div>
        </div>
        <div class="col-md-12 mb-1">
            <div class="row">
                <div class="col-md-5">
                    <hr class="divider w-75 word_span"></hr>
                </div>
            </div>
        </div>
        <div class="col-md-4 d-flex justify-content-end">
            <input type="text" id="result-input" class="w-75 form-control input-lg"/>
        </div>
    </div>
    <div class="row justify-content-center mt-5">
        <button type="button" class="btn btn-primary btn-lg mod2-next-btn" disabled>Go to next stage</button>
    </div>`;

    document.getElementById("center-panel").innerHTML = eleCenterPanel;
  }

  async function getQuestionData(url) {
    // URL :  "http://15.206.80.44/api/v2/maths/4/1/get_data"
    // const testUrl = "https://api.myjson.com/bins/b36vi";
    // TODO: Remove proxy url appended for testing
    const questionUrl = url;
    const response = await fetch(questionUrl,{headers:
      {
        Accept: 'application/json',
        Authorization: 'UKreajCWVVzA8vJ9ZB6oyFSvlqkINTHvD2vGeNxBcaG9UtJDxYnftOOc1yVt'
      }});
    const json = await response.json();

    question = json.data.question;

    questionId =
      json.data && json.data.question_id ? json.data.question_id : "";
    questionAudioList = [question.larger_number.spelling,question.operator.spelling,question.smaller_number.spelling,'equals'];

    return question;
  }

  async function submitAnswer() {
    const userInput = document.getElementById("result-input").value;
    // const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const postRequestUrl = "http://15.206.80.44/api/v2/maths/4/2/post_user_response";

    const data = {
      start_time: "",
      end_time: "",
      user_response: +userInput,
      question_id: questionId
    };
    const response = await fetch(postRequestUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: 'application/json',
        Authorization: 'UKreajCWVVzA8vJ9ZB6oyFSvlqkINTHvD2vGeNxBcaG9UtJDxYnftOOc1yVt'  
      },
      body: JSON.stringify(data)
    });

    const json = await response.json();
    const { state, get_url: getUrl, post_url: postUrl } = json.data;

    switch (state) {
      case 0: {
        // Get Next Question
        getNextQuestion(getUrl);
        break;
      }
      case 1: {
        // Go to Next Module
        goToNextModule();
        break;
      }
      case 2: {
        // Handle wrong answer
        handleIncorrectAnswer();
      }
    }
  }

  function getNextQuestion(url) {
    const randomNumber = Math.floor(Math.random() * Math.floor(2));
    questionLayout = randomNumber == 0 ? "horizontal" : "vertical";

    getQuestionData(url)
      .then(data => {
        renderQuestion(data, questionLayout);
      })
      .then(() => {
        if (question.larger_number.value < 8) {
          renderImages();
        }
      });
  }

  function goToNextModule() {}

  function handleIncorrectAnswer() {
    const inputBox = document.getElementById("result-input");
    inputBox.setAttribute("style", "border-bottom: 3px solid red");
    document.getElementById("input-error-msg").classList.remove("hide");
  }

  function onPlayBtnClick() {
    currentSpeakIndex = 0;
    speakQuestion(currentSpeakIndex)
  }

  function speakQuestion(index){
    utterance.text = questionAudioList[index]
    speechSynthesis.speak(utterance);
  }

  function onFormatQuestBtnClick() {
    const toggleLayout =
      questionLayout == "horizontal" ? "vertical" : "horizontal";
    renderQuestion(question, toggleLayout);
  }

  function toogleHighlight(){
    wordSpans[currentSpeakIndex].classList.toggle('highlight');
  }

  utterance.onstart = toogleHighlight

  utterance.onend = function() {
    toogleHighlight();
    if(currentSpeakIndex<wordSpans.length-1){
      speakQuestion(++currentSpeakIndex);
    }
  };

  $("#center-panel").on("input", "#result-input", onResultInputChange);
  $("#center-panel").on("click", ".mod2-next-btn", submitAnswer);

  document.getElementById("playbtn").onclick = onPlayBtnClick;
  document.getElementById("formatQuesBtn").onclick = onFormatQuestBtnClick;
})();
