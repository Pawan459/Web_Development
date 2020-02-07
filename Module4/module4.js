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
    startTime, correctAnswer, userAnswer, questionId;

// Function Declrations
const voiceAssistant = (voiceMessage) =>{
    let assistant = new SpeechSynthesisUtterance()
    assistant.text = voiceMessage
    speechSynthesis.speak(assistant)
}
const allowDrop = (event) => {
    event.preventDefault();
}

const readCaption = ()=>{
    let assistant = new SpeechSynthesisUtterance()
    assistant.text = caption;
    if(caption){
        assistant.onend = ()=>{
            captionTimeoutId = setTimeout(readCaption,1000)
        };
        speechSynthesis.speak(assistant);
    } else {
        captionTimeoutId = setTimeout(readCaption,1000);
    }
}

const drag = (event)=> {
    let voiceText  = event.toElement.innerText
    voiceAssistant(voiceText)
    let parent = event.target.parentElement
    if(parent.className == 'blanks'){
        let first = parent.firstChild
        console.log(first)
        first.style.display = 'block'
    }
    // document.getElementById().par
    event.dataTransfer.setData("text", event.target.id);
}

function triggerBoxDrop(event){
    event.preventDefault();
    let data = event.dataTransfer.getData("text");
    event.target.appendChild(document.getElementById(data));
}

function triggerDrop(event,ui) {


    event.preventDefault();
    event.toElement.classList.remove('blanks-border')
  
    //Grab the slot number and card number
  var answerValue = $(this).data('value');
  var dragedValue = ui.draggable.data('value');
  
//   console.log($(this),answerValue,dragedValue);

  //If the cards was dropped to the correct slot,
  //change the card colour, position it directly
  //on top of the slot and prevent it being dragged again
  if (answerValue === dragedValue) {
    $(this).droppable('disable');
    ui.draggable.position({
      of: $(this), my: 'left top', at: 'left top'
    });
    //This prevents the card from being
    //pulled back to its initial position
    //once it has been dropped
    ui.draggable.draggable('option', 'revert', false);
    correctCards++; //increment keep track correct cards

    // this.appendChild(ui.draggable);
  }


    // if(event.toElement.hasChildNodes()){
    //     let message = `Please Choose another blank to drop text`
    //     voiceAssistant(message)
    //     return
    // }
    // let data = event.dataTransfer.getData("text");
    // event.target.appendChild(document.getElementById(data));
}
const showBlock = (event) => {
    event.preventDefault();
    event.toElement.classList.add('blanks-border')
}

const removeBlock = (event) => {
    event.preventDefault();
    event.toElement.classList.remove('blanks-border')
    event.toElement.classList.remove('wrongAnswer')
    event.toElement.parentElement.classList.remove('blanks-border')
    event.toElement.parentElement.classList.remove('wrongAnswer')
}

const correctionMessage = (message) =>{
    let interval = setInterval(()=>{
        if(isAnswerCorrect){
            clearInterval(interval)
            return
        }
        voiceAssistant(message)
    },15000)
}

const showErrorToUser = ()=>{
    for(let i = 0;i<userAnswer.length;i++){
        if(userAnswer[i] != correctAnswer[i]){
            let blank = blanks[i]
            blank.classList.add('wrongAnswer')
        }
    }
}

const checkAnswer = () =>{
    return correctCards == correctAnswer.length;
    // isAnswerCorrect = true
    // for(let i = 0;i<userAnswer.length;i++){
    //     if(userAnswer[i] != correctAnswer[i]){
    //         isAnswerCorrect = false
    //         wrongFilledBlanks.push(blanks[i])
    //     }
    // }
    // return isAnswerCorrect == true
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
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
const setModule = (shuffledData) =>{
    let dataLength = shuffledData.length

    // Making Boxes With Text In The DOM
    for (let index = 0; index < dataLength; index++) {
        const parentElement = makeElement('div', `box${index}`, 'box','',shuffledData[index]);
        parentElement.style.backgroundColor = getRandomColor();
        // parentElement.style.top = (Math.random() * 150) +'px';;
        // parentElement.style.left = (index * eleBoxes.offsetWidth / dataLength)+'px';


        // parentElement.draggable = true
        parentElement.addEventListener('dragstart',drag)


        $(parentElement).data( 'value', shuffledData[index] ).draggable({
            containment: '#module1-panel',
            cursor: 'move',
            revert: true
          });


        eleBoxes.append(parentElement)
        boxes.push(parentElement)
    }

    // Making Blank Spaces In The DOM
    for (let index = 0; index < dataLength; index++) {
        const box = boxes[index]
         const blank = makeElement('div',`blank${index}`,'box blanks',"","");

        blank.innerHTML = correctAnswer[index] ;
        let spell = makeElement('label',numberSpelling[index+1],'spell',"",numberSpelling[index+1])
        blank.append(spell)
        $(blank).data('value', correctAnswer[index] ).droppable( {
            accept: '.box',
            hoverClass: 'blanks-border',
            drop: triggerDrop
          } );
        // blank.addEventListener('drop',triggerDrop)
        //blank.addEventListener('dragover',allowDrop)
        blank.addEventListener('dragenter', showBlock)
        blank.addEventListener('dragleave', removeBlock)
        blank.addEventListener('mouseover', updateBlank)
        blank.addEventListener('click', removeBlock)
        eleBlank.append(blank)
        blanks.push(blank)
    }
    
}

const resetModule = (event) =>{
    eleBlank.innerHTML = ""
    eleBoxes.innerHTML = ""
    boxes = [] 
    blanks = []
    wrongFilledBlanks = []
    userAnswer = []
    correctAnswer = []
    renderInit()
}

const setUserData = (submitTime, status)=>{
    endTime = submitTime
    userData.status = status
    postMethod(postURL, userData)
}

const updateUserData = (dataObject) => {
    currentData = dataObject
    const question = currentData.question
    correctAnswer = currentData.answer
    const daysArray = currentData.shuffled

    for (let i = 0; i < question.length; i++) {
        if (question[i].state == 1) {
            const requiredDay = makeElement('input', `question${i}`, 'col')
            requiredDay.addEventListener('change', speakWord)
            eleBlanks.append(requiredDay)
        }
        else {
            const requiredDay = makeElement('div', `question${i}`, 'col', "", question[i].value)
            eleBlanks.append(requiredDay)
        }
    }

    for (let i = 0; i < daysArray.length; i++) {
        const day = makeElement('div', `day${i}`, 'col-auto box', "", daysArray[i])
        eleShuffledArray.append(day)
    }
}

const updateBlank = (event) => {
    if(isAnswerCorrect == true) return
    let index = event.target.id.toString().split('blank')[1]
    let element = document.createElement('div')
    element.innerHTML = correctAnswer[index]
    element.style.fontSize = '1.6rem'
    // if(element.innerHTML == undefined){
    //     return
    // }
    // if(event.target.childElementCount >= 1){
    //     return
    // }
    // event.target.appendChild(element)
    // setTimeout(event.target.remove(event.target.lastChild),2000)
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
    }
    console.log(data)
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

const validateAnswer = (event)=>{
    // Making the array empty
    userAnswer.splice(0, userAnswer.length)

    // Initializing the array with the user Answer
    let combinedAnswer = ""
    blanks.map(blank => {
        blank.classList.remove('wrongAnswer')
        userAnswer.push(blank.innerText)
        combinedAnswer += blank.innerText+" "
    })

    // Speaking the user Answer
    // voiceAssistant(`You filled the answer as ${combinedAnswer}`)

    if(checkAnswer()){
        eleNextStageButton.classList.remove('next-stage-btn-wobbel')
        voiceAssistant(`Congratulations!! correct answer.`)
        setUserData(new Date(), 0)
        eleCssHead.classList.add('right-ans')
        setTimeout(()=>{renderInit();
            eleCssHead.classList.remove('right-ans');},3000);
    }
    else{
        eleNextStageButton.classList.add('next-stage-btn-wobbel')
        eleCssHead.classList.add('wrong-ans');
        setTimeout(()=>{eleCssHead.classList.remove('wrong-ans');},3000);
        showErrorToUser()
        let message = `You have entered wrong answer please reshuffle the blocks and press next button`
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