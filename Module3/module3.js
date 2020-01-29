// Variable Declartaion
const getDataReference = {
    "status": "success",
    "status_code": 200,
    "message": "Problem fetched successfully",
    "data": {
        "asset": "http://15.206.80.44/storage/data/Apple.png",
        "caption": "Apple is a fruit",
        "shuffled": [
            "fruit",
            "is",
            "Apple",
            "a"
        ],
        "answer": [
            "Apple",
            "is",
            "a",
            "fruit"
        ],
        "question_id": 16
    }
}


// Dom Elements
const eleBlank = document.getElementById('blanks')
const eleBox = document.getElementById('boxes')
const eleImage = document.getElementById('sourceImage')
const eleNextStageButton = document.getElementById('nextStageButton')
// const eleImageCaption = document.getElementById('captionImage')

// static elements
const domainName = `15.206.80.44`
const getURL = `http://${domainName}/api/v2/english/5/1/get_data`
const postURL = `http://${domainName}/api/v2/english/5/1/post_user_response`
let shuffled = null, userAnswer = [], correctAnswer = null, questionID = null, startTime = null, endTime = null
let boxes =[], blanks = [], isInAir = false, dynamic_div_offset = [0, 0]
const userData = {
    "status": "success",
    "status_code": 200,
    "message": "Saved user response",
    "data": {
        "state": 2,
        "get_url": null,
        "post_url": null,
        "helper": {
            "next_question": 0,
            "next_module": 1,
            "wrong_answer": 2
        }
    }
}


// Function Declrations
const voiceAssistant = (voiceMessage) =>{
    let assistant = new SpeechSynthesisUtterance()
    assistant.text = voiceMessage
    speechSynthesis.speak(assistant)
}
const allowDrop = (event) => {
    event.preventDefault();
}

const drag = (event)=> {
    let voiceText  = event.toElement.innerText
    voiceAssistant(voiceText)
    event.dataTransfer.setData("text", event.target.id);
}

const triggerDrop = (event) => {
    event.preventDefault();
    let data = event.dataTransfer.getData("text");
    event.target.appendChild(document.getElementById(data));
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

const setModule = (shuffledData) =>{
    let dataLength = shuffledData.length

    // Making Boxes With Text In The DOM
    for (let index = 0; index < dataLength; index++) {
        const parentElement = makeElement('div', `box${index}`, 'col-auto box');
        const childElement = makeElement('label', `boxlabel${index}`, 'boxLabel', "", shuffledData[index])
        childElement.draggable = true
        childElement.addEventListener('dragstart',drag)
        parentElement.addEventListener('dragover',allowDrop)
        parentElement.addEventListener('drop',triggerDrop)
        parentElement.append(childElement)
        eleBox.append(parentElement)
        boxes.push(childElement)
    }

    // Making Blank Spaces In The DOM
    for (let index = 0; index < dataLength; index++) {
        const box = boxes[index]
        const blank = makeElement('div',`blank${index}`,'col-auto blanks',"","");
        blank.addEventListener('drop',triggerDrop)
        blank.addEventListener('dragover',allowDrop)
        eleBlank.append(blank)
        blanks.push(blank)
    }
    
}

const updateUserData = (dataObject) =>{

    // Initializing the userData for the Post Response
    questionID = dataObject.question_id
    shuffled = dataObject.shuffled
    correctAnswer = dataObject.answer

    // Setting Image Source 
    eleImage.src = dataObject.asset
    startTime = new Date()

    // Set User Module
    setModule(shuffled)
}

const setUserData = (submitTime, status)=>{
    endTime = submitTime
    userData.status = status
    postMethod(postURL, userData)
}

const getMethod = (url) => {
    fetch(url, {
        method: 'GET',
        dataType: 'json',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'UKreajCWVVzA8vJ9ZB6oyFSvlqkINTHvD2vGeNxBcaG9UtJDxYnftOOc1yVt'
            // 'Access-Control-Allow-Methods': '*'
        },
        contentType: 'application/json; charset=utf-8',
        
    })
        .then(res => res.json())
        .then(data => updateUserData(data))
        .catch(err => console.log('we got a error in Get Method', err))
}

const postMethod = (url, userData) => {
    console.log(userData)
    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'UKreajCWVVzA8vJ9ZB6oyFSvlqkINTHvD2vGeNxBcaG9UtJDxYnftOOc1yVt'
        },
        data: {
            start_time: startTime, 
            end_time: endTime, 
            user_response: userAnswer, 
            question_id: questionID, 
            user_data: userData
        },
    })
        .then(res => JSON.stringify(res))
        .then(data => console.log(data))
        .catch(err => console.log('we encountered a error in POST Method', err))
}

const validateAnswer = (event)=>{
    // Making the array empty
    userAnswer.splice(0, userAnswer.length)

    // Initializing the array with the user Answer
    let combinedAnswer = ""
    blanks.map(blank => {
        userAnswer.push(blank.innerText)
        combinedAnswer += blank.innerText+" "
    })

    // Speaking the user Answer
    voiceAssistant(`You filled the answer as ${combinedAnswer}`)

    if (userAnswer.values == correctAnswer.values){
        setUserData(new Date(), 0)
    }
    else{
        setUserData(new Date(), 2)
    }

}

const renderInit = () =>{
    //getMethod(getURL)
    getData()
    .then(dataObject => updateUserData(dataObject.data));
}


function getData(){
    let data = getDataReference;
    return new Promise((resolve, reject)=>{
        resolve(data);
    })
}

function postData() {
    let data = userData;
    return new Promise((resolve, reject) => {
        resolve(data);
    })
}

// Event Bindings here

window.addEventListener('load', renderInit)

eleNextStageButton.addEventListener('click', validateAnswer)