'use strict'

// Variable Declarations

const mainContent = document.getElementById('mainContent')
const sideBySide = document.getElementById('sideBySide')
const oneNumberBelow = document.getElementById('oneNumberBelow')
const differenceOfNumber =  document.getElementById('answer')
const nextPageBtn = document.getElementById('nextPage')

const answerSpelling = document.getElementById('answerSpelling')
const answerSideSpelling = document.getElementById('answerSideSpelling')

let finalAnswer, correctAnswer;

const side_Module_InputDigit1 = document.getElementById('answer0')
const side_Module_InputDigit2 = document.getElementById('answer1')
const side_Module_InputDigit3 = document.getElementById('answer2')

let questionNumber = 0
const getURL = `http://15.206.80.44/subtraction_without_borrow/${questionNumber}/get_data`
const postURL = `http://15.206.80.44/subtraction_addition/send_user_response`
const nextModuleURL = 'http://127.0.0.1/next_module_name'
let wrongAnswer=false
let userData = {
        "status": "success",
        "status_code": 200,
        "message": "User response recorded",
        "data":  {
            "message": null,
            "url": null
            }
    }

const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];


// Function Declarations

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
    firstDigit.innerHTML = digits[0]
    secondDigit.innerHTML = digits[1]
    thirdDigit.innerHTML = digits[2]

    eleFirstNumber.appendChild(firstDigit)
    eleFirstNumber.appendChild(secondDigit)
    eleFirstNumber.appendChild(thirdDigit)

    let answerSpelling = makeElement('input','answerSideSpellingFirst','answerSideSpelling')
    answerSpelling.value = convertToWords(firstNumber)
    eleFirstNumber.appendChild(answerSpelling)


    // Second Number Setup
    firstDigit = makeElement('div', 'firstDigit', 'firstDigit')
    secondDigit = makeElement('div', 'secondDigit', 'secondDigit')
    thirdDigit = makeElement('div', 'thirdDigit', 'thirdDigit')

    digits = getDigits(secondNumber)
    firstDigit.innerHTML = digits[0]
    secondDigit.innerHTML = digits[1]
    thirdDigit.innerHTML = digits[2]

    eleSecondNumber.appendChild(firstDigit)
    eleSecondNumber.appendChild(secondDigit)
    eleSecondNumber.appendChild(thirdDigit)

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
    setAppleModule(questionDetails)
}

const getMethod = (url) =>{
    fetch('./shared/getData.json',{
        method: 'GET',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => updateUserData(data))
}

const postMethod = (url, userData) =>{
    fetch(url,{
        method:'POST',
        headers: 'Content-type',
        body: JSON.stringify(userData)
    }).then(res => JSON.stringify(userData)).then(data => console.log(data))
}

const addClass = (element, className) =>{
    element.classList.add(className)
}

const removeClass = (element, className) => {
    element.classList.remove(className)
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
    getMethod(getURL)
    addClass(oneNumberBelow, 'oneNumberBelow-appear')
    disableInputFields()
}

const validateAnswer = (event) => {
    if (finalAnswer != correctAnswer){
        questionNumber += 1
        wrongAnswer = true
        userData.data.message ='NEXT_QUESTION'
        userData.data.url = getURL
    }
    else{
        wrongAnswer = false
        userData.data.message = 'NEXT_MODULE'
        userData.data.url = nextModuleURL
    }
    postMethod(postURL, userData)
    // need to see post data file
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