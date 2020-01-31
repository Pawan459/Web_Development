const eleBlanks = document.getElementById('fillBlanks'),
eleShuffledArray = document.getElementById('shuffledArray'),
eleNextStageButton = document.getElementById('nextStageButton')

let currentData,
startTime, correctAnswer, userAnswer,questionId;

function init(){
    fetchData();
}

function fetchData(){
    getData()
    .then(({data})=>{
        currentData = data;
        startTime = new Date()
        render();
    });
}

function speak(msg){
    let speech = new SpeechSynthesisUtterance();
    speech.rate = 0.7;
    speech.pitch = 1;
    speech.volume = 1;
    speech.voice = speechSynthesis.getVoices()[0];
    speech.text = msg;

    speechSynthesis.speak(speech);
}

function playCaption(){
    speak(currentData.caption);
}


function getData(){
    let data={
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

    return new Promise((res)=>{res(data)});
    
}

function speakWord(event){
    const message = event.target.value
    userAnswer = message
    speak(message)
}

function makeElement(type, elementID, elementClass, value = "", text = "", width = null){
    let element = document.createElement(type)
    element.id = elementID
    element.className = elementClass
    element.value = value
    element.innerText = text
    if (width != null) {
        element.width = width
    }
    return element
}

function validateAnswer(event){
    if(userAnswer == correctAnswer){
        // postMethod
    }
    else{
        // postMethod
    }
}

function render(){
    const question = currentData.question
    correctAnswer = currentData.answer
    const daysArray = currentData.shuffled

    for(let i = 0;i<question.length;i++){
        if(question[i].state == 1){
            const requiredDay = makeElement('input',`question${i}`,'col')
            requiredDay.addEventListener('change',speakWord)
            eleBlanks.append(requiredDay)
        }
        else{
            const requiredDay = makeElement('div', `question${i}`, 'col',"", question[i].value)
            eleBlanks.append(requiredDay)
        }
    }

    for(let i = 0;i<daysArray.length;i++){
        const day = makeElement('div',`day${i}`,'col',"",daysArray[i])
        eleShuffledArray.append(day)
    }
}

eleNextStageButton.addEventListener('click', validateAnswer)

init();