const eleBody = document.body
let headerCount = 0, currTop = undefined, divIndex = undefined, scrollDown = true
let mainDivArray = []

const makeContent = () => {
    let mainDiv = document.createElement('div')
    mainDiv.className = 'container'

    let header = document.createElement('div')
    header.className = 'header'
    header.id = `header${headerCount++}`
    header.innerHTML = 'Sticky Thing'

    mainDiv.appendChild(header)

    for(let i = 0;i<6;i++){
        let div = document.createElement('div')
        div.className = i
        div.id = i
        div.innerHTML = i
        mainDiv.appendChild(div)
    }
    mainDivArray.push(mainDiv)
    return mainDiv
}

const renderInit = (event) => {
    for(let i = 0;i<6;i++){
        eleBody.insertBefore(makeContent(), eleBody.firstChild)
    }
    divIndex = mainDivArray.length - 1
    currTop = mainDivArray[divIndex].getBoundingClientRect().top
}

const visibleElement = (element) => {
    // Now I have to check whether the currTop is greater than bottom of currentDiv
    let eleRect = element.getBoundingClientRect()
    let bottom = eleRect.bottom
    console.log(currTop, bottom)
    
    if(scrollDown) return currTop <= bottom
    return currTop >= bottom
}

const scrollWindowEvent = (event) => {
    console.log(divIndex)
    if(scrollDown){
        if (!mainDivArray[divIndex]) return

        let header = mainDivArray[divIndex].getElementsByClassName('header')[0]
        if (visibleElement(mainDivArray[divIndex])) {
            header.classList.add('sticky')
        }
        else {
            header.classList.remove('sticky')
            divIndex--
            if (divIndex == -1) {
                scrollDown = false
                divIndex = 0
            }
            if (!mainDivArray[divIndex]) return
            currTop = mainDivArray[divIndex].getBoundingClientRect().top
        }

    }
    else{
        if (!mainDivArray[divIndex]) return

        let header = mainDivArray[divIndex].getElementsByClassName('header')[0]
        if (visibleElement(mainDivArray[divIndex])) {
            header.classList.add('sticky')
        }
        else {
            header.classList.remove('sticky')
            divIndex++
            if (divIndex == mainDivArray.length) {
                divIndex -= 1
                scrollDown = true
            }
            if (!mainDivArray[divIndex]) return
            currTop = mainDivArray[divIndex].getBoundingClientRect().top
        }
    }
}

window.addEventListener('load', renderInit)

window.addEventListener('scroll', scrollWindowEvent)