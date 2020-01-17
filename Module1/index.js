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
    let speech = new SpeechSynthesisUtterance()
    speech.rate = 0.7
    speech.pitch = 1
    speech.volume = 1
    speech.voice = speechSynthesis.getVoices()[0]
    speech.text = msg

    speechSynthesis.speak(speech)

    setTimeout(()=>{
        message.style.display = 'none'
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

window.onload = ()=>{
    OpenNav()
    setTimeout(CloseNav, 2000);
    let elem = document.getElementById(key)
    console.log(arrow.offsetLeft)
    console.log(elem.offsetLeft)
}

window.onkeypress = (e)=>{
    if(e.key == key){
        block0.style.opacity = 0
        block0.style.zIndex = -1000
        block1.style.zIndex = 1000
        block1.style.opacity = 1
        block1.style.display = 'block'
        keyCode += 1
        key = String.fromCharCode(keyCode)
        voiceAssistant(`You pressed ${String.fromCharCode(keyCode-33)} in keyboard`)
    }
}

leftNav.addEventListener('click', ()=>{
    OpenNav()
})

voiceAssis.addEventListener('click', (e)=>{
    e.preventDefault()
    voiceAssistant(message.innerText)
})