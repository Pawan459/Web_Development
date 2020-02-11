const [eleBucket1Cntr, eleBucket2Cntr] = document.getElementsByClassName('bucket-cntr'), 
eleSwipeImg = document.getElementById('swipe-img'),
eleSwipeImgCntr = document.getElementById('swipe-img-cntr'),
eleSwipeText = document.querySelector('#swipe-img-cntr p'),
eleBucket1Text = document.getElementById('bucket1-text'),
eleBucket2Text = document.getElementById('bucket2-text'),
elePlayBtn = document.getElementById('audio-btn');

let currentData,
startTime;

function init(){
    fetchData();
}

function fetchData(){
    getData()
    .then(({data})=>{
        currentData = data;
        render();
    });
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("answer", ev.target.dataset.answer);
}

function drop(ev) {
    ev.preventDefault();

    let data = ev.dataTransfer.getData("answer");
    let eleDiv = ev.target.closest('div');

    if(eleDiv.dataset.value === data){
        renderRight(eleDiv.innerText, eleDiv.dataset.value);
    } else {
        renderWorng(eleDiv.innerText, eleDiv.dataset.value);
    }
}

function renderRight(bucketText, user_response){
    speak(currentData.text +' is '+ bucketText);
}

function renderWorng(bucketText, user_response){
    speak(currentData.text +' is not '+ bucketText);
}

function speak(msg){
    let speech = new SpeechSynthesisUtterance();
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;
    speech.voice = speechSynthesis.getVoices()[0];
    speech.text = msg;

    speechSynthesis.speak(speech);
}

function playCaption(){
    speak(currentData.caption);
}


function getData(){
    let data={
        "status": "success",
        "status_code": 200,
        "message": "Problem fetched successfully",
        "data": {
            "text": "B",
            "asset": "http://15.206.80.44/storage/images/alphabets/A.png",
            "caption": "B for Ball",
            "answer": "0",
            "helper": {
                "vowel": 0,
                "consonant": 1
            },
            "question_id": 15
        }
    };

    return new Promise((res)=>{res(data)});
    
}

function render(){
    let [bucket1Text,bucket2Text] = Object.keys(currentData.helper);

    eleBucket1Text.innerHTML = bucket1Text.toUpperCase();
    eleBucket2Text.innerHTML = bucket2Text.toUpperCase();
    eleBucket1Cntr.dataset.value = currentData.helper[bucket1Text];
    eleBucket2Cntr.dataset.value = currentData.helper[bucket2Text];
    eleSwipeText.innerHTML = currentData.text + currentData.text.toLowerCase();

    // eleSwipeImg.src = currentData.asset;
    eleSwipeImgCntr.dataset.answer = currentData.answer;

}


eleBucket1Cntr.ondrop = drop;
eleBucket1Cntr.ondragover = allowDrop;
eleBucket2Cntr.ondrop = drop;
eleBucket2Cntr.ondragover = allowDrop;
eleSwipeImgCntr.ondragstart = drag;
elePlayBtn.onclick = playCaption;

init();