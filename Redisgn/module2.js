'use strict'

// Variable Declarations

const mainContent = document.getElementById('mainContent')
const sideBySide = document.getElementById('sideBySide')
const oneNumberBelow = document.getElementById('oneNumberBelow')
const differenceOfNumber =  document.getElementById('answer')
const answerSpelling = document.getElementById('answerSpelling')
const nextPageBtn = document.getElementById('nextPage')
const url = `./shared/getData.json`
const NEXT_MODULE = 'http://127.0.0.1/next_module_name'
const NEXT_QUESTION = 'http://127.0.0.1/subtraction_addition/get_data'
let WRONG_ANSWER=false
let userData = {
        "status": "success",
        "status_code": 200,
        "message": "User response recorded",
        "data":  {
            "message": null,
            "url": null
            }
    }




// Function Declarations

const toWords = (number) =>{
    const wordArray = ['Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine']
    return wordArray[number]
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
    numberLabelSpelling.innerHTML = `(${toWords(7)})`
    eleFirstNumber.appendChild(numberLabelSpelling)

    let numberLabel = makeElement('label', 'value1', 'value')
    numberLabel.innerHTML = `7`
    eleFirstNumber.appendChild(numberLabel)
    
    let appleArray = makeApple(7)
    appleArray.forEach(apple => {
        eleFirstNumber.appendChild(apple)
    });

    

    // Setting the second number
    numberLabelSpelling = makeElement('label', 'spelling2', 'value')
    numberLabelSpelling.innerHTML = `(${toWords(4)})`
    eleSecondNumber.appendChild(numberLabelSpelling)

    numberLabel = makeElement('label', 'value2', 'value')
    numberLabel.innerHTML = `4`
    eleSecondNumber.appendChild(numberLabel)

    const sign = makeElement('h1','minus','minus')
    eleSecondNumber.appendChild(sign)

    appleArray = makeApple(4)
    appleArray.forEach(apple => {
        eleSecondNumber.appendChild(apple)
    });

}

const setSideModule = (questionDetails)=>{
    
}

const updateSpelling = (event)=>{
    let number = differenceOfNumber.value
    if(number<10)
        answerSpelling.value = toWords(number)
    else
        answerSpelling.value = `One Digit`
}

const updateUserData = (data)=>{
    let questionDetails = data['data']['question']
    setAppleModule(questionDetails)
}

const getMethod = (url) =>{
    fetch(url,{
        method: 'GET',
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

const renderInit = () =>{
    getMethod(url)
    answerSpelling.value = toWords(0)
    answerSpelling.disabled = true
    oneNumberBelow.classList.add('oneNumberBelow-appear')
}

const validateAnswer = (event) => {
    let difference = differenceOfNumber.value
    if (difference > 9) {
        WRONG_ANSWER = true
        userData.data.message = `You answered Wrongly`
        userData.data.url = NEXT_QUESTION
        // POST Method  
    }
}

const loadWindow = (event) =>{
    renderInit()
}
// Event Bindings

differenceOfNumber.addEventListener('input',updateSpelling)

window.addEventListener('load', loadWindow)

nextPageBtn.addEventListener('click', validateAnswer)