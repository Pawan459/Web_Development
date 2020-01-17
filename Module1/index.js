const leftNav = document.getElementById('leftnav')
const voiceAssis = document.getElementById('voice-assis')
const block0 =  document.getElementById('block0')
const block1 = document.getElementById('block1')
const message = document.getElementById('message')

voiceAssistant = (msg) => {
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
}

CloseNav = () => {
    document.getElementById("leftSideNav").style.width = "0";
    document.getElementById("main").style.marginLeft = "50px";
    leftNav.style.transition = "all 1s ease"
    leftNav.style.display = 'block'
}

window.onload = ()=>{
    OpenNav()
    setTimeout(CloseNav, 2000);
}

window.onkeypress = (e)=>{
    if(e.key == 'a'){
        block0.style.display = 'none'
        block1.style.transition = 'all 1s ease-in-out'
        block1.style.display = 'block'
        voiceAssistant('You Presed A on Keyboard')
    }
}

leftNav.addEventListener('click', ()=>{
    OpenNav()
})

voiceAssis.addEventListener('click', (e)=>{
    e.preventDefault()
    voiceAssistant(message.innerText)
})