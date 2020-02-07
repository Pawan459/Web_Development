// Dom Elements
const eleBlanks = document.getElementById('fillBlanks'),
    eleShuffledArray = document.getElementById('shuffledArray'),
    eleNextStageButton = document.getElementById('nextStageButton'),
    eleCssHead = document.getElementById('cssHead'),
    eleResetButton = document.getElementById('resetButton')
// const eleImageCaption = document.getElementById('captionImage')

// static elements
const domainName = `15.206.80.44`
const getURL = undefined
const postURL = undefined
let currentData,
    startTime, correctAnswer, userAnswer, questionId, status, isAnswerCorrect = false;

// Function Declrations
const voiceAssistant = (voiceMessage) =>{
    let assistant = new SpeechSynthesisUtterance()
    assistant.text = voiceMessage
    speechSynthesis.speak(assistant)
}

const makeElement = (type, elementID, elementClass, value = "", text = "", width = null)=>{
    let element = document.createElement(type)
    element.id = elementID
    element.className = elementClass
    element.value = value
    element.innerText = text
    if(width != null){
        element.width = width
    }
    return element
}
  
const setModule = () =>{
    const question = currentData.question
    correctAnswer = currentData.answer.toString()
    correctAnswer = correctAnswer.toLowerCase()
    const daysArray = currentData.shuffled

    for (let i = 0; i < question.length; i++) {
        if (question[i].state == 1) {
            const requiredDay = makeElement('input', `question${i}`, 'col-auto blank-input')
            requiredDay.addEventListener('change', speakWord)
            eleBlanks.append(requiredDay)
        }
        else {
            const requiredDay = makeElement('div', `question${i}`, 'col-auto blank', "", question[i].value)
            eleBlanks.append(requiredDay)
        }
    }

    for (let i = 0; i < daysArray.length; i++) {
        const day = makeElement('div', `day${i}`, 'col-auto box', "", daysArray[i])
        eleShuffledArray.append(day)
    }   
}

const resetModule = (event) =>{
    eleBlanks.innerHTML = ""
    eleShuffledArray.innerHTML=""
    renderInit()
}

const setUserData = (submitTime, questionStatus)=>{
    endTime = submitTime
    status = questionStatus
    postMethod(postURL)
}

const updateUserData = (dataObject) => {
    currentData = dataObject
    questionId = currentData.question_id
    setModule()
}

const getMethod = (url) => {
    if(url == undefined){
        getData()
        .then(({ data }) => {
            startTime = new Date()
            updateUserData(data);
        });
        return
    }
    fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Authorization': 'UKreajCWVVzA8vJ9ZB6oyFSvlqkINTHvD2vGeNxBcaG9UtJDxYnftOOc1yVt'
        },        
    })
        .then(res => res.json())
        .then(data => updateUserData(data.data))
        .catch(err => console.log('we got a error in Get Method', err))
}

const postMethod = (url) => {
    let data = {
        start_time: startTime, 
        end_time: endTime, 
        user_response: userAnswer,
        question_id: questionId,  
    }
    console.log(data)
    if(url == undefined) return
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: 'application/json',
            Authorization: 'UKreajCWVVzA8vJ9ZB6oyFSvlqkINTHvD2vGeNxBcaG9UtJDxYnftOOc1yVt'
        },
        body: JSON.stringify(data)
    })
        .then(res => JSON.stringify(res))
        .then(data => console.log(data))
        .catch(err => console.log('we encountered a error in POST Method', err))
}

const correctionMessage = (message) => {
    let interval = setInterval(() => {
        if (isAnswerCorrect) {
            clearInterval(interval)
            return
        }
        voiceAssistant(message)
    }, 15000)
}

const validateAnswer = (event)=>{
    if(userAnswer.toLowerCase() == correctAnswer){
        isAnswerCorrect = true
        eleNextStageButton.classList.remove('next-stage-btn-wobbel')
        voiceAssistant(`Congratulations!! correct answer.`)
        setUserData(new Date(), 0)
        eleCssHead.classList.add('right-ans')
        setTimeout(() => {
            resetModule();
            eleCssHead.classList.remove('right-ans');
        }, 3000);
    }
    else{
        isAnswerCorrect = false
        eleNextStageButton.classList.add('next-stage-btn-wobbel')
        eleCssHead.classList.add('wrong-ans');
        setTimeout(() => { eleCssHead.classList.remove('wrong-ans'); }, 3000);
        // showErrorToUser()
        let message = `You have entered wrong answer please check again`
        correctionMessage(message)
    }
}

const renderInit = () =>{
    getMethod(getURL)
}

function clearMemory(){
    clearTimeout(captionTimeoutId);
    eleBlank.innerHTML = '';
    blanks = [];
}


function getData() {
    let data = {
        "status": "success",
        "status_code": 200,
        "message": "Problem fetched successfully",
        "data": {
            "question": [
                {
                    "value": "Saturday",
                    "state": 0
                },
                {
                    "value": "Sunday",
                    "state": 1
                },
                {
                    "value": "Monday",
                    "state": 0
                }
            ],
            "answer": [
                "Sunday"
            ],
            "shuffled": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
            ],
            "helper": {
                "pre_filled": 0,
                "user_input_required": 0
            },
            "question_id": 2
        }
    }

    return new Promise((res) => { res(data) });
}

function postData() {
    let data = userData;
    return new Promise((resolve, reject) => {
        resolve(data);
    })
}

function speakWord(event) {
    const message = event.target.value
    userAnswer = message
    voiceAssistant(message)
}

function renderStart(){
    let btnStart = document.getElementById('startBtn');
    let [a,b,c,d] = document.getElementsByClassName('not-start');

    btnStart.onclick = ()=>{ 
        renderInit();
        a.classList.remove('not-start');
        b.classList.remove('not-start');
        c.classList.remove('not-start');
        d.classList.remove('not-start');
        btnStart.classList.add('not-start');
    };
}



// Event Bindings here


window.addEventListener('load', renderStart)

eleNextStageButton.addEventListener('click', validateAnswer)

eleResetButton.addEventListener('click', resetModule)