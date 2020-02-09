(function(){
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
    const eleBoxes = document.getElementById('boxes')
    const eleImage = document.getElementById('sourceImage')
    const eleNextStageButton = document.getElementById('nextStageButton')
    const eleCssHead = document.getElementById('cssHead')
    const eleResetButton = document.getElementById('resetButton')
    // const eleImageCaption = document.getElementById('captionImage')

    // static elements
    const domainName = `15.206.80.44`
    const getURL = `http://${domainName}/api/v2/english/5/1/get_data`
    const postURL = `http://${domainName}/api/v2/english/5/1/post_user_response`
    let shuffled = null, questionID = null, startTime = null, endTime = null
    let boxes = [], blanks = [], wrongFilledBlanks = [], userAnswer = [], correctAnswer = []
    let isInAir = false, isAnswerCorrect = true, caption = '', captionTimeoutId = 0, correctCards = 0;
    const numberSpelling = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
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
    const voiceAssistant = (voiceMessage) => {
        let assistant = new SpeechSynthesisUtterance()
        assistant.text = voiceMessage
        speechSynthesis.speak(assistant)
    }
    const allowDrop = (event) => {
        event.preventDefault();
    }

    const readCaption = () => {
        let assistant = new SpeechSynthesisUtterance()
        assistant.text = caption;
        if (caption) {
            assistant.onend = () => {
                captionTimeoutId = setTimeout(readCaption, 1000)
            };
            speechSynthesis.speak(assistant);
        } else {
            captionTimeoutId = setTimeout(readCaption, 1000);
        }
    }

    const drag = (event) => {
        let voiceText = event.toElement.innerText
        voiceAssistant(voiceText)
        let parent = event.target.parentElement
        if (parent.className == 'blanks') {
            let first = parent.firstChild
            console.log(first)
            first.style.display = 'block'
        }
        // document.getElementById().par
        event.dataTransfer.setData("text", event.target.id);
    }

    function triggerBoxDrop(event) {
        event.preventDefault();
        let data = event.dataTransfer.getData("text");
        event.target.appendChild(document.getElementById(data));
    }

    function triggerDrop(event, ui) {


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

    const correctionMessage = (message) => {
        let interval = setInterval(() => {
            if (isAnswerCorrect) {
                clearInterval(interval)
                return
            }
            voiceAssistant(message)
        }, 15000)
    }

    const showErrorToUser = () => {
        for (let i = 0; i < userAnswer.length; i++) {
            if (userAnswer[i] != correctAnswer[i]) {
                let blank = blanks[i]
                blank.classList.add('wrongAnswer')
            }
        }
    }

    const checkAnswer = () => {
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

    const makeElement = (type, elementID, elementClass, value = "", text = "", width = null) => {
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
    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    const setModule = (shuffledData) => {
        let dataLength = shuffledData.length

        // Making Boxes With Text In The DOM
        for (let index = 0; index < dataLength; index++) {
            const parentElement = makeElement('div', `box${index}`, 'box', '', shuffledData[index]);
            parentElement.style.backgroundColor = getRandomColor();
            // parentElement.style.top = (Math.random() * 150) +'px';;
            // parentElement.style.left = (index * eleBoxes.offsetWidth / dataLength)+'px';


            // parentElement.draggable = true
            parentElement.addEventListener('dragstart', drag)


            $(parentElement).data('value', shuffledData[index]).draggable({
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
            const blank = makeElement('div', `blank${index}`, 'box blanks', "", "");

            blank.innerHTML = correctAnswer[index];
            let spell = makeElement('label', numberSpelling[index + 1], 'spell', "", numberSpelling[index + 1])
            blank.append(spell)
            $(blank).data('value', correctAnswer[index]).droppable({
                accept: '.box',
                hoverClass: 'blanks-border',
                drop: triggerDrop
            });
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

    const resetModule = (event) => {
        eleBlank.innerHTML = ""
        eleBoxes.innerHTML = ""
        boxes = []
        blanks = []
        wrongFilledBlanks = []
        userAnswer = []
        correctAnswer = []
        renderInit()
    }

    const setUserData = (submitTime, status) => {
        endTime = submitTime
        userData.status = status
        postMethod(postURL, userData)
    }

    const updateUserData = (dataObject) => {

        // Initializing the userData for the Post Response
        questionID = dataObject.question_id
        shuffled = dataObject.shuffled
        correctAnswer = dataObject.answer
        caption = dataObject.caption
        correctCards = 0

        // Setting Image Source 
        eleImage.src = dataObject.asset
        startTime = new Date()

        // Set User Module
        setModule(shuffled)
    }

    const updateBlank = (event) => {
        if (isAnswerCorrect == true) return
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

    const postMethod = (url, userData) => {
        let data = {
            start_time: startTime,
            end_time: endTime,
            user_response: userAnswer,
            question_id: questionID,
        }
        console.log(userData)
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

    const validateAnswer = (event) => {
        // Making the array empty
        userAnswer.splice(0, userAnswer.length)

        // Initializing the array with the user Answer
        let combinedAnswer = ""
        blanks.map(blank => {
            blank.classList.remove('wrongAnswer')
            userAnswer.push(blank.innerText)
            combinedAnswer += blank.innerText + " "
        })

        // Speaking the user Answer
        // voiceAssistant(`You filled the answer as ${combinedAnswer}`)

        if (checkAnswer()) {
            eleNextStageButton.classList.remove('next-stage-btn-wobbel')
            voiceAssistant(`Congratulations!! correct answer.`)
            setUserData(new Date(), 0)
            eleCssHead.classList.add('right-ans')
            setTimeout(() => {
                renderInit();
                eleCssHead.classList.remove('right-ans');
            }, 3000);
        }
        else {
            eleNextStageButton.classList.add('next-stage-btn-wobbel')
            eleCssHead.classList.add('wrong-ans');
            setTimeout(() => { eleCssHead.classList.remove('wrong-ans'); }, 3000);
            showErrorToUser()
            let message = `You have entered wrong answer please reshuffle the blocks and press next button`
            correctionMessage(message)
        }

    }

    const renderInit = () => {
        getMethod(getURL)
        clearMemory();
        readCaption();
        eleBoxes.addEventListener('dragover', allowDrop)
        eleBoxes.addEventListener('drop', triggerBoxDrop)

        // .then(dataObject => console.log(dataObject));
    }

    function clearMemory() {
        clearTimeout(captionTimeoutId);
        eleBlank.innerHTML = '';
        blanks = [];
    }


    function getData() {
        let data = getDataReference;
        return new Promise((resolve, reject) => {
            resolve(data);
        })
    }

    function postData() {
        let data = userData;
        return new Promise((resolve, reject) => {
            resolve(data);
        })
    }

    function renderStart() {
        let btnStart = document.getElementById('startBtn');
        let [a, b, c, d] = document.getElementsByClassName('not-start');

        btnStart.onclick = () => {
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
}())