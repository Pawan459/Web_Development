const eleBody = document.body
let headerCount = 0, currTop = undefined, stickyElement = undefined

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
    if(headerCount == 0){
        let header = document.createElement('div')
        header.className = 'header'
        header.id = `header${headerCount}`
        header.innerHTML = 'Sticky Thing'
        mainDiv.appendChild(header)
    }
    return mainDiv
}

const renderInit = (event) => {
    for(let i = 0;i<10;i++){
        let div = makeContent()
        if(headerCount == 0){
            headerCount++
            let parentDiv = document.createElement('div')
            parentDiv.className = 'wrapperDiv'
            parentDiv.id = 'wrapperDiv1'
            parentDiv.appendChild(div)
            eleBody.append(parentDiv)

            parentDiv.style.height = div.getBoundingClientRect().height+'px'
        }
        else eleBody.append(div)
    }

    stickyElement = document.getElementById('header0')
    currTop = stickyElement.offsetTop
}

const scrollWindowEvent = (event) => {
    let scrollTop = window.scrollY
    if(scrollTop >= currTop){
        stickyElement.classList.add('sticky')
    }
    else{
        stickyElement.classList.remove('sticky')
    }
}

window.addEventListener('load', renderInit)

window.addEventListener('scroll', scrollWindowEvent)