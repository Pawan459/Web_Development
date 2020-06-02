const eleContainer = document.getElementById('container');

const setColor = (element) => {
    const color = getRandomColor();
    element.style.background = color;
    element.style.boxshadow = `0 0 2px ${color}, 0 0 10px ${color}`;
}

const removeColor = (element) => {
    element.style.background = '#1d1d1d';
    element.style.boxShadow = `0 0 2px #000`;
}

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const renderInit = (event) => {
    const TOTAL_SQUARES = 500;
    eleContainer.style.width = TOTAL_SQUARES+'px';

    for (let i = 0; i < TOTAL_SQUARES; i++) {
        const square = document.createElement('div');
        square.classList.add('square');

        square.addEventListener('mouseover', () => {
            setColor(square);
        });

        square.addEventListener('mouseout', () => {
            removeColor(square);
        });

        eleContainer.appendChild(square);
    }
}

window.addEventListener('load', renderInit);