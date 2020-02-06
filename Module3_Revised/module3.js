// Variable Declarations

// Dom Elements
const eleSubmitButton = document.getElementById('submitButton')
const eleOptions = document.getElementById('options')
const eleBlanks = document.getElementById('blanks')

// static variables

let currElement=null, blanksArray = []
let drag = undefined, drop = undefined, totalBlanks = undefined


// Function Declarations

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getRandomColor = () => {
    const red = getRandomInt(0, 255);
    const green = getRandomInt(0, 255);
    const blue = getRandomInt(0, 255);
    return `rgb(${red},${green},${blue})`
}

const renderInit = (event) =>{
    const options = [...eleOptions.getElementsByTagName('div')]
    let index = 0
    options.forEach(element => {
        element.style.backgroundColor = getRandomColor()
        element.classList.add('dragme')
        element.id = `option${index++}`
        element.addEventListener('mouseover', swapElement)
    });
    index = 0
    const blank = [...eleBlanks.getElementsByClassName('blank')]
    totalBlanks = blank.length
    blank.forEach(element => {
        element.id = `blank${index++}`
        element.addEventListener('mouseover', blankAccept)
        blanksArray.push(undefined)
    });


    document.addEventListener('mousedown', startDrag)

    document.addEventListener('mouseup', stopDrag)
}

const swapElement = (event) =>{
    
}

const blankAccept = (event) =>{
    let currTarget = event.target
    console.log(currTarget)
    console.log(targ)
    let index = currTarget.id.toString().split('blank')[1]
    if(drag){
        drop = false
        drag = false
        targ.style.left = coordX + event.clientX - offsetX + 'px';
        targ.style.top = coordY + event.clientY - offsetY + 'px';
        // document.getElementById().style.
        currTarget.style.width = targ.width + 10 + 'px'
        currTarget.style.height = targ.height + 5 + 'px'
    }
    else{
        currTarget.style.minWidth = 70 + 'px'
        currTarget.style.minHeight = 20 + 'px'
    }
    
    return false
}

const startDrag = (event) => {
    if (!event) {
        event = window.event;
    }
    if (event.preventDefault) event.preventDefault();

    targ = event.target ? event.target : event.srcElement;

    currElement = targ
    
    if (targ.className != 'col dragme') { return };
    
    offsetX = event.clientX;
    offsetY = event.clientY;

    if (!targ.style.left) { targ.style.left = '0px' };
    if (!targ.style.top) { targ.style.top = '0px' };

    coordX = parseInt(targ.style.left);
    coordY = parseInt(targ.style.top);

    drag = true;
    drop = true;

    document.onmousemove = dragDiv;
    return false;

}
const dragDiv = (event)=> {
    if (!drag) { return };
    if (!event) {event = window.event};
    // var targ=event.target?event.target:event.srcElement;
    // move div element
    targ.style.left = coordX + event.clientX - offsetX + 'px';
    targ.style.top = coordY + event.clientY - offsetY + 'px';
    return false;
}
const stopDrag = (event) => {
    drag = false;
    if (!event) {
        event = window.event;
    }
    if (event.preventDefault) event.preventDefault();

    targ = event.target ? event.target : event.srcElement;
    
    if(drop){
        targ.style.left = 0 + 'px'
        targ.style.top = 0 + 'px'        
    }
}



// Event Listeners

window.addEventListener('load', renderInit)