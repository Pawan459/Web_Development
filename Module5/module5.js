(function(){
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
        startTime, correctAnswer = [], userAnswer = [], questionId, status, isAnswerCorrect = false;

    let wordMap = new Map()
    // Function Declrations
    const voiceAssistant = (voiceMessage) => {
        let assistant = new SpeechSynthesisUtterance()
        assistant.text = voiceMessage
        speechSynthesis.speak(assistant)
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

    const removeWord = (event) => {
        wordMap.delete(event.target.id)
        event.target.remove()
    }

    const updateBlanks = (event) => {
        let word = makeElement('div', `blank${event.target.id}`, 'col-auto blank', "", event.target.innerText)
        word.addEventListener('click', removeWord)
        if (!wordMap.has(word.id)) {
            eleBlanks.appendChild(word)
            wordMap.set(word.id, word)
            // voiceAssistant(word.innerText)
        }
    }

    const setModule = () => {
        correctAnswer = currentData.answer
        correctAnswer.sort(comparatorString)
        const words = currentData.shuffled

        for (let i = 0; i < words.length; i++) {
            const word = makeElement('div', `word${i}`, 'col-auto box', "", words[i])
            word.addEventListener('click', updateBlanks)
            eleShuffledArray.append(word)
        }
    }

    const resetModule = (event) => {
        eleBlanks.innerHTML = ""
        eleShuffledArray.innerHTML = ""
        userAnswer = []
        wordMap = new Map()
        renderInit()
    }

    const setUserData = (submitTime, questionStatus) => {
        endTime = submitTime
        status = questionStatus
        postMethod(postURL)
    }

    const updateUserData = (dataObject) => {
        currentData = dataObject
        questionId = currentData.question_id
        startTime = new Date()
        setModule()
    }

    const getMethod = (url) => {
        if (url == undefined) {
            getData()
                .then(({ data }) => {
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

    const makeFormattedDate = (dateObject) => {

        Number.prototype.padding = function (base, chr) {
            var len = (String(base || 10).length
                - String(this).length) + 1;

            return len > 0 ? new Array(len).join(chr || '0')
                + this : this;
        }

        let result = [dateObject.getFullYear().padding(),
        (dateObject.getMonth() + 1).padding(),
        dateObject.getDate().padding()].join('-')
            + ' ' + [dateObject.getHours().padding(),
            dateObject.getMinutes().padding(),
            dateObject.getSeconds().padding()].join(':');
        return result
    }

    const postMethod = (url) => {
        let data = {
            question_id: questionId,
            start_time: makeFormattedDate(startTime),
            end_time: makeFormattedDate(endTime),
            user_response: [userAnswer],
        }
        console.log(data)
        if (url == undefined) return
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json',
                'Authorization': 'UKreajCWVVzA8vJ9ZB6oyFSvlqkINTHvD2vGeNxBcaG9UtJDxYnftOOc1yVt'
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

    const comparatorString = (a, b) => {
        a = a.toLowerCase()
        b = b.toLowerCase()

        return a > b ? -1 : b > a ? 1 : 0
    }

    const comparatorNodeString = (a, b) => {
        a = a[0]
        b = b[0]
        a = a.toLowerCase()
        b = b.toLowerCase()

        return a > b ? -1 : b > a ? 1 : 0
    }

    const checkAnswer = () => {
        if (userAnswer.length < correctAnswer) {
            let message = `Please choose all the correct Answers`
            voiceAssistant(message)
            return isAnswerCorrect
        }

        isAnswerCorrect = true
        for (let i = 0; i < userAnswer.length; i++) {
            if (!correctAnswer.includes(userAnswer[i][0])) {
                isAnswerCorrect = false
                userAnswer[i][1].classList.add('wrongAnswer')
            }
        }

        return isAnswerCorrect
    }

    const validateAnswer = (event) => {
        userAnswer = []
        eleBlanks.childNodes.forEach(element => userAnswer.push([element.innerText, element]))
        userAnswer.shift()
        userAnswer.sort(comparatorNodeString)
        if (checkAnswer()) {
            eleNextStageButton.classList.remove('next-stage-btn-wobbel')
            voiceAssistant(`Congratulations!! correct answer.`)
            setUserData(new Date(), 0)
            eleCssHead.classList.add('right-ans')
            setTimeout(() => {
                resetModule();
                eleCssHead.classList.remove('right-ans');
            }, 3000);
        }
        else {
            eleNextStageButton.classList.add('next-stage-btn-wobbel')
            eleCssHead.classList.add('wrong-ans');
            setTimeout(() => { eleCssHead.classList.remove('wrong-ans'); }, 3000);
            // showErrorToUser()
            let message = `You have entered wrong answer please check again`
            correctionMessage(message)
        }
    }

    const renderInit = () => {
        getMethod(getURL)
    }

    function clearMemory() {
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
                    "a"
                ],
                "question_id": 16
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