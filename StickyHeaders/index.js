const eleBody = document.body
let headerCount = 0

const headerEvent = (event) =>{
    console.log(event)
}

const makeContent = () => {
    let mainDiv = document.createElement('div')
    mainDiv.className = 'container'

    for(let i = 0;i<6;i++){
        let div = document.createElement('div')
        div.className = i
        div.id = i
        div.innerHTML = i
        mainDiv.appendChild(div)
    }

    let header = document.createElement('div')
    header.className = 'header'
    header.id = `header${headerCount++}`
    header.innerHTML = 'Sticky Thing'
    header.addEventListener('scroll', headerEvent)

    mainDiv.appendChild(header)
    console.log(mainDiv)
    return mainDiv
}

const renderInit = (event) => {
    for(let i = 0;i<6;i++){
        eleBody.insertBefore(makeContent(), eleBody.firstChild)
    }
}

const makeCurrentHeaderSticky = (event) => {
    let headers = document.getElementsByClassName('header')
    
}

window.addEventListener('load', renderInit)

window.addEventListener('scroll', makeCurrentHeaderSticky)