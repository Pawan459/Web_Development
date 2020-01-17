const leftNav = document.getElementById('leftnav')
const voiceAssis = document.getElementById('voice-assis')
const block0 =  document.getElementById('block0')
const block1 = document.getElementById('block1')
const message = document.getElementById('message')
const keyboard = document.getElementById('keyboard')
const arrow = document.getElementById('arrow')
let isNavOpen = false
let keyCode = 97
let key = String.fromCharCode(keyCode)

voiceAssistant = (msg) => {
    message.innerText = `Now time to press ${String.fromCharCode(keyCode - 32)} in keyboard`
    message.style.display = 'block'
    updatePosition(arrow, key)
    let speech = new SpeechSynthesisUtterance()
    speech.rate = 0.7
    speech.pitch = 1
    speech.volume = 1
    speech.voice = speechSynthesis.getVoices()[0]
    speech.text = msg

    speechSynthesis.speak(speech)

    setTimeout(()=>{
        message.style.display = 'none'
        updatePosition(arrow, key)
    },5000)
}

OpenNav = () => {
    document.getElementById("leftSideNav").style.width = "250px"
    document.getElementById("main").style.marginLeft = "140px"
    leftNav.style.transition = "all 1s ease"
    leftNav.style.display = 'none'
    isNavOpen = true
}

CloseNav = () => {
    document.getElementById("leftSideNav").style.width = "0";
    document.getElementById("main").style.marginLeft = "50px";
    leftNav.style.transition = "all 1s ease"
    leftNav.style.display = 'block'
    isNavOpen = false
}

updatePosition = (moveElement, referenceElementId) =>{
    let elem = document.getElementById(referenceElementId)
    elem.style.animation = 'fadeInOut 0.6s infinite'
    elem = elem.getBoundingClientRect()
    moveElement.style.left = (elem.left-25) + 'px'
    moveElement.style.top = (elem.top-194) +'px'
    moveElement.style.bottom = elem.bottom + 'px'
    moveElement.style.right = elem.right + 'px'
}

successEvent = ()=>{
    block0.style.opacity = 0
    block1.style.opacity = 1
}

failureEvent = ()=>{
    block1.style.opacity = 0
    block0.style.opacity = 1
    voiceAssistant(`Please Click On the Voice Assistant Image to Know Which Key To Press`)
}

window.onresize = (e)=>{
    updatePosition(arrow, key)
}

window.onload = (e)=>{
    OpenNav()
    setTimeout(CloseNav, 2000);
    updatePosition(arrow, key)
}

window.onkeypress = (e)=>{
    if (keyCode == 132) return
    if(e.key == key){
        successEvent()
        document.getElementById(key).style.animation = 'none'
        keyCode += 1
        key = String.fromCharCode(keyCode)
        updatePosition(arrow, key)
        voiceAssistant(`You pressed ${String.fromCharCode(keyCode-33)} in keyboard`)
    }
    else{
        failureEvent()
    }
}

keyboard.addEventListener('mouseover',(e)=>{
    updatePosition(arrow, key)
})

keyboard.addEventListener('mouseout',(e)=>{
    updatePosition(arrow, key)
})

leftNav.addEventListener('click', (e)=>{
    OpenNav()
})

voiceAssis.addEventListener('click', (e)=>{
    e.preventDefault()
    voiceAssistant(message.innerText)
})