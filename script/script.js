
// smooth scroll to the btn section
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        document.getElementById("vocab_container").classList.add("hidden")

        const target = document.querySelector(this.getAttribute("href"));
        const offset = 100;
        const position = target.offsetTop - offset;

        window.scrollTo({
            top: position,
            behavior: "smooth"
        });
    });
});
// loader
const showLoader = () => {
    document.getElementById("spinner").classList.remove("hide");
    document.getElementById("vocab_container").classList.add("hide");
}
const hideLoader = () => {
    document.getElementById("spinner").classList.add("hide");
    document.getElementById("vocab_container").classList.remove("hide");
}
// default lesson page before clicking any lesson button
const defaultLessonHide = () =>{
    document.getElementById("selected_no_lesson").classList.add("hidden");
}


// get started btn
document.getElementById("btn_start").addEventListener("click", function (event) {
    event.preventDefault();

    const nameInput = document.getElementById("inp_name").value;
    const passInput = document.getElementById("inp_pass").value;

    if(nameInput === ""){
        return alert("Please fill your Name first.")    
    }
    if(passInput === ""){
        return alert("insert password")
    }
 
    if (passInput === "123456") {
        const fontPage = document.querySelectorAll(".hidden");

        for (let font of fontPage) {
            font.classList.remove("hidden");
        }
        const banner = document.getElementById("banner");
        banner.classList.add("hidden")

    }
    else{
        return alert("Invalid password")
    }
    
})
// logout button functionalities
document.getElementById("btn_logout").addEventListener("click", (event) => {
    document.getElementById("vocab_container").innerHTML = ""
    const banner = document.getElementById("banner");
    const defaultPage = document.querySelectorAll(".display");
    for(let page of defaultPage){

        page.classList.add("hidden");
    }
    banner.classList.remove("hidden");
    


})

// lesson button
const catchLesson = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then(res => res.json())
        .then(data => btnLesson(data.data))
}
function btnLesson(lesson) {
    const lessonBtn = document.getElementById("btn-container");

    for (let les of lesson) {
        const btn = document.createElement("div");
        btn.innerHTML = `<button id="btn-${les.level_no}" onclick="loadVocab(${les.level_no})" class="btn btn-primary btn-outline"><i class="fa-solid fa-book-open"></i>Lesson-${les.level_no}</button>`;
        lessonBtn.append(btn);
    }
}
catchLesson()
// lesson btn active by clicking
function removeActiveClass (){
    const active = document.getElementsByClassName("active");
    for(let btn of active){
        btn.classList.remove("active");
    }
}

// load vocab from api
const loadVocab = (id) => {
    document.getElementById("vocab_container").classList.remove("hidden");
    const url = `https://openapi.programming-hero.com/api/level/${id}`
    showLoader();
    defaultLessonHide();
    fetch(url)
        .then(res => res.json())
        .then(data => {
            removeActiveClass();

            displayVocab(data.data)

            const clickedBtn = document.getElementById(`btn-${id}`);
            clickedBtn.classList.add("active");
    })
}
// display vocab
const displayVocab = (vocabularies) => {
    
    const vocabContainer = document.getElementById("vocab_container");

    vocabContainer.innerHTML = ""
    if(vocabularies.length == 0){

        vocabContainer.innerHTML = `<div id="no_vocabulary" class="col-span-full flex flex-col justify-center items-center">
                    <img class="h-40" src="assets/alert-error.png" alt="">
                    <p class="text-xs text-gray-500">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                    <h2 class="text-2xl font-semibold py-3">নেক্সট Lesson এ যান</h2>
                </div>`

    }

    for (let vocab of vocabularies) {
        
        const vocabCard = document.createElement("div");
        vocabCard.innerHTML = `
                <div class="card bg-base-100 shadow-md p-5">
                    <div class="card-body items-center text-center">
                        <h2 class="text-xl font-semibold py-1">${vocab.word}</h2>
                        <p class="text-sm font-semibold">${vocab.meaning == null ? `"অর্থ নেই"` : vocab.meaning }</p>
                        <h2 class="text-xl font-semibold py-4 ">${vocab.pronunciation}</h2>

                    </div>
                    <div class="flex justify-between ">
                        <button onclick="loadWordDetails(${vocab.id})" class="btn"><i class="fa-solid fa-circle-info"></i></button>
                        <button onclick="pronounceWord('${vocab.word}')" class="btn"><i class="fa-solid fa-volume-high"></i></button>
                    </div>
                </div>`
        vocabContainer.append(vocabCard);    
    }
    hideLoader();
}
function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
}

// load word details
const loadWordDetails = (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`

    fetch(url)
    .then(res => res.json())
    .then(data => displayWordDetails(data.data))
}

const displayWordDetails = (word) => {
    const wordModal = document.getElementById("word_details_modal")
    wordModal.showModal();

    const wordTitle = document.getElementById("word_title");
    wordTitle.innerHTML = `<h2 class="text-xl font-semibold">${word.word}(<i class="fa-solid fa-microphone-lines"></i> :${word.pronunciation})</h2>`;
    
    const wordMeaning = document.getElementById("word_meaning");
    wordMeaning.innerHTML = `<p class="text-sm">${word.meaning == null ? `<p class="text-sm font-semibold">"অর্থ নেই"</p>` : word.meaning}</p>`;

    const wordSentence = document.getElementById("word_sentence");
    wordSentence.innerHTML = `<p class="text-sm">${word.sentence}</p>`;

    const wordSynonyms = document.getElementById("word_synonyms");
    wordSynonyms.innerHTML = "";
    const synonyms = word.synonyms;
    const synonymsDiv =document.createElement("div");
    if(!synonyms.length ){
        synonymsDiv.innerHTML = `<p class="text-sm font-semibold">"সমার্থক শব্দ নেই" </p>`
        wordSynonyms.append(synonymsDiv);
        return;
    }
    
    console.log(synonyms)
    for(let syn of synonyms){   
            
        // if(syn.length > 0){
        //     console.log(true)
        // }
        // else{
        //     console.log(false)
        // }
        const synonymsDiv =document.createElement("div");
        synonymsDiv.innerHTML = `${synonyms.length <= 0 ? `"সমার্থক শব্দ নেই"` : `<p class="btn text-sm">${syn}</p>` }`
        wordSynonyms.append(synonymsDiv);
    }
    
}



// sweetalert
document.getElementById("btn_logout").addEventListener("click", function () {
    Swal.fire({
        title: "Logged Out!",
        text: "You have been successfully logged out.",
        icon: "success",
        confirmButtonText: "OK",
    })
});
document.getElementById("btn_start").addEventListener("click", function () {
    Swal.fire({
        title: "Logged In!",
        text: "You have been successfully logged in.",
        icon: "success",
        confirmButtonText: "OK",
    })
});