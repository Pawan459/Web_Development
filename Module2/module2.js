'use strict'

// Variable Declarations

const mainContent = document.getElementById('mainContent')
const sideBySide = document.getElementById('sideBySide')
const oneNumberBelow = document.getElementById('oneNumberBelow')
const differenceOfNumber =  document.getElementById('answer')
const nextPageBtn = document.getElementById('nextPage')

const answerSpelling = document.getElementById('answerSpelling')
const answerSideSpelling = document.getElementById('answerSideSpelling')

let finalAnswer, correctAnswer

const side_Module_InputDigit1 = document.getElementById('answer0')
const side_Module_InputDigit2 = document.getElementById('answer1')
const side_Module_InputDigit3 = document.getElementById('answer2')

let questionNumber = -1
let getURL = null
let wrongAnswer = false
let userData = {
    "status": "success",
    "status_code": 200,
    "message": "User response recorded",
    "data": {
        "message": null,
        "url": null
    }
}
const rightAnswerMessage = `You answered it correctly loading the next module`
const wrongAsnswerMessage = `You answered it wrong please try again`
const localUrl = './shared/getData.json'
const postURL = `http://15.206.80.44/subtraction_addition/send_user_response`

const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];


// Function Declarations

const voiceAssistant = (voiceMessage) => {
    let speech = new SpeechSynthesisUtterance()
    speech.text = voiceMessage

    speechSynthesis.speak(speech)
}

const generateDelay = (function_name, delayTime) => {
    setTimeout(function_name, delayTime)
}

const convertHundreds = (num) => {
    if (num > 1000) return 'Only Three Digit'
    if (num > 99) return ones[Math.floor(num / 100)] + " hundred " + convertTens(num % 100)
    else return convertTens(num)
}

const convertTens = (num) => {
    if (num < 10) return ones[num]
    else if (num >= 10 && num < 20) return teens[num - 10]
    else return tens[Math.floor(num / 10)] + " " + ones[num % 10]
}

const convertToWords = (num) => {
    if (num == 0) return "zero"
    else return convertHundreds(num)
}

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getRandomColor = ()=>{
    const red = getRandomInt(0, 255);
    const green = getRandomInt(0, 255);
    const blue = getRandomInt(0, 255);
    return `rgb(${red},${green},${blue})`
}

const getDigits = (num) =>{
    let digit = []
    num = num.toString()
    for(let i = 0;i<num.length;i++)
        digit.push(parseInt(num.charAt(i)+""))
    return digit
}

const addClass = (element, className) => {
    element.classList.add(className)
}

const removeClass = (element, className) => {
    element.classList.remove(className)
}

const makeURL = () =>{
    if(questionNumber < 0) return localUrl
    return `http://15.206.80.44/api/v2/maths/3/1/get_data`
}

const makeElement = (type, elementId, elementClass)=>{
    let element = document.createElement(type)
    element.id = elementId
    element.className = elementClass
    return element
}

const makeApple = (appleQuantity)=>{
    const appleArray = []
    for(let i = 1;i<=appleQuantity; i++){
        let element = makeElement('div',`apple${i}`,'apple')
        element.style.backgroundColor = getRandomColor()
        appleArray.push(element)
    }
    return appleArray
}

const setAppleModule = (questionDetails)=>{
    let firstNumber = questionDetails['upper_number']['value']
    let secondNumber = questionDetails['lower_number']['value']

    // Inserting elements dynamically in the dom

    const eleFirstNumber = makeElement('div','firstNumber','subtract')
    const eleSecondNumber = makeElement('div', 'secondNumber', 'subtract')

    oneNumberBelow.insertBefore(eleSecondNumber, oneNumberBelow.firstChild)
    oneNumberBelow.insertBefore(eleFirstNumber, oneNumberBelow.firstChild)


    // Setting the first Number
    let numberLabelSpelling = makeElement('label', 'spelling1', 'value')
    numberLabelSpelling.innerHTML = `(${convertToWords(firstNumber)})`
    eleFirstNumber.appendChild(numberLabelSpelling)

    let numberLabel = makeElement('label', 'value1', 'value')
    numberLabel.innerHTML = `${firstNumber}`
    eleFirstNumber.appendChild(numberLabel)
    
    let appleArray = makeApple(firstNumber)
    appleArray.forEach(apple => {
        eleFirstNumber.appendChild(apple)
    });

    

    // Setting the second number
    numberLabelSpelling = makeElement('label', 'spelling2', 'value')
    numberLabelSpelling.innerHTML = `(${convertToWords(secondNumber)})`
    eleSecondNumber.appendChild(numberLabelSpelling)

    numberLabel = makeElement('label', 'value2', 'value')
    numberLabel.innerHTML = `${secondNumber}`
    eleSecondNumber.appendChild(numberLabel)

    const sign = makeElement('h1','minus','minus')
    eleSecondNumber.appendChild(sign)

    appleArray = makeApple(secondNumber)
    appleArray.forEach(apple => {
        eleSecondNumber.appendChild(apple)
    });

}

const setSideModule = (questionDetails)=>{
    let firstNumber = questionDetails['larger_number']['value']
    let secondNumber = questionDetails['smaller_number']['value']

    // Inserting elements dynamically in the dom

    const eleFirstNumber = makeElement('div', 'firstNumberSide', 'sideNumber')
    const eleSecondNumber = makeElement('div', 'secondNumberSide', 'sideNumber')

    sideBySide.insertBefore(eleSecondNumber, sideBySide.firstChild)
    // Inserting Operator
    let operator = makeElement('h1', 'minus', 'minus')
    sideBySide.insertBefore(operator, sideBySide.firstChild)
    sideBySide.insertBefore(eleFirstNumber, sideBySide.firstChild)


    // Setting the first Number
    let firstDigit = makeElement('div','firstDigit','firstDigit')
    let secondDigit = makeElement('div','secondDigit','secondDigit')
    let thirdDigit = makeElement('div','thirdDigit','thirdDigit')

    let digits = getDigits(firstNumber)
    if(digits[0] != undefined){
        firstDigit.innerHTML = digits[0]
        eleFirstNumber.appendChild(firstDigit)
    }
    if (digits[1] != undefined) {
        secondDigit.innerHTML = digits[1]
        eleFirstNumber.appendChild(secondDigit)
    }
    if (digits[2] != undefined) {
        thirdDigit.innerHTML = digits[2]
        eleFirstNumber.appendChild(thirdDigit)
    }

    let answerSpelling = makeElement('input','answerSideSpellingFirst','answerSideSpelling')
    answerSpelling.value = convertToWords(firstNumber)
    eleFirstNumber.appendChild(answerSpelling)


    // Second Number Setup
    firstDigit = makeElement('div', 'firstDigit', 'firstDigit')
    secondDigit = makeElement('div', 'secondDigit', 'secondDigit')
    thirdDigit = makeElement('div', 'thirdDigit', 'thirdDigit')

    digits = getDigits(secondNumber)

    if (digits[0] != undefined) {
        firstDigit.innerHTML = digits[0]
        eleSecondNumber.appendChild(firstDigit)
    }
    if (digits[1] != undefined) {
        secondDigit.innerHTML = digits[1]
        eleSecondNumber.appendChild(secondDigit)
    }
    if (digits[2] != undefined) {
        thirdDigit.innerHTML = digits[2]
        eleSecondNumber.appendChild(thirdDigit)
    }

    answerSpelling = makeElement('input', 'answerSideSpellingSecond', 'answerSideSpelling')
    answerSpelling.value = convertToWords(secondNumber)
    eleSecondNumber.appendChild(answerSpelling)

}

const updateSpelling = (event)=>{
    let number = differenceOfNumber.value
    finalAnswer = number
    if(number<10)
        answerSpelling.value = convertToWords(number)
    else
        answerSpelling.value = `One Digit`
}

const updateSideSpelling = (event) =>{
    let firstDigit = side_Module_InputDigit1.value
    let secondDigit = side_Module_InputDigit2.value
    let thirdDigit = side_Module_InputDigit3.value
    let number = parseInt(firstDigit+""+secondDigit+""+thirdDigit)
    finalAnswer = number
    if(number<1000)
        answerSideSpelling.value =convertToWords(number)
    else
        answerSideSpelling.value = `Three Digit Only`
}

const updateUserData = (data)=>{
    let questionDetails = data['data']['question']
    correctAnswer = data['data']['answer']['value']
    if(questionNumber == -1){
        setAppleModule(questionDetails)
    }else{
        setSideModule(questionDetails)
    }
}

const clearModule = (moduleName) =>{
    while(moduleName.childElementCount != 1){
        let child = moduleName.firstChild
        moduleName.removeChild(child)
    }
    // You can also use moduleName.innerHTML = "" that would be more efficient
    // But here i have to maintain the last child that's why kept it
}

const getMethod = (url) =>{
    fetch(url,{
        method: 'GET',
        Headers: {
            'Accept': 'application/json',
            'Authorization': 'UKreajCWVVzA8vJ9ZB6oyFSvlqkINTHvD2vGeNxBcaG9UtJDxYnftOOc1yVt'
        }
    })
        .then(res => res.json())
        .then(data => updateUserData(data))
        .catch(err => console.log('we got a error in Get Method', err))
}

const postMethod = (url, userData) =>{
    console.log(userData)
    fetch(url,{
        method:'POST',
        headers: {
            'Content-type' : 'application/json',
            'Accept': 'application/json',
            'Authorization': 'UKreajCWVVzA8vJ9ZB6oyFSvlqkINTHvD2vGeNxBcaG9UtJDxYnftOOc1yVt'
        }
        // body: JSON.stringify(userData)
    })
    .then(res => JSON.stringify(userData))
    .then(data => console.log(data))
    .catch(err => console.log('we encountered a error in POST Method', err))
}

const disableInputFields = () =>{
    try {
        answerSpelling.disabled = true
        updateSpelling(this)
    } catch (error) {
        console.log(error)
    }

    try {
        answerSideSpelling.disabled = true
        answerSideSpellingFirst.disabled = true
        answerSideSpellingSecond.disabled = true
        updateSideSpelling(this)
    } catch (error) {
        console.log(error)
    }   
    
    
}

const renderInit = () =>{
    getMethod(localUrl)
    addClass(oneNumberBelow, 'oneNumberBelow-appear')
    // addClass(sideBySide, 'side-by-side-appear')
    // setSideModule({
    //     "larger_number":{
    //         "value": 723
    //     },
    //     "smaller_number":{
    //         "value" : 123
    //     }
    // })
    disableInputFields()
}

// validate answer need to be updated after loading index.js file
// need to use async-await 
// await to show animation of Subtraction
const validateAnswer = (event) => {
    if(questionNumber<0) {
        // For local URL
        if(finalAnswer == correctAnswer){
            voiceAssistant(rightAnswerMessage)
            questionNumber += 1
            getURL = makeURL()
            // Clearing the module so as to set the Side Number Module
            clearModule(oneNumberBelow)
            generateDelay(getMethod(getURL),2000)
            removeClass(oneNumberBelow, 'oneNumberBelow-appear')
            addClass(sideBySide, 'side-by-side-appear')
            return
        }
        voiceAssistant(wrongAsnswerMessage)
        return
    }
    if (finalAnswer != correctAnswer){
        wrongAnswer = true
        userData.data.message ='WRONG_ANSWER'
        userData.data.url = getURL
        voiceAssistant(wrongAsnswerMessage)
    }
    else{
        questionNumber += 1
        wrongAnswer = false
        userData.data.message = 'NEXT_QUESTION'
        userData.data.url = getURL
        voiceAssistant(rightAnswerMessage)
        clearModule(sideBySide)
        getURL = makeURL()
        getMethod(getURL)
    }
    postMethod(postURL, userData)
}

const loadWindow = (event) =>{
    renderInit()
}


// Event Bindings

differenceOfNumber.addEventListener('input',updateSpelling)

side_Module_InputDigit1.addEventListener('input', updateSideSpelling)

side_Module_InputDigit2.addEventListener('input',updateSideSpelling)

side_Module_InputDigit3.addEventListener('input',updateSideSpelling)

window.addEventListener('load', loadWindow)

nextPageBtn.addEventListener('click', validateAnswer)