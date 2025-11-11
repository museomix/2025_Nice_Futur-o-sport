let currentQuestionIndex = 0;
let index = 0;
let answers = [];
let evolutionCount = 1;

let music = new Audio('bgm.mp3');
music.volume = 0.8;
music.loop = true;


const questions = [
    {
        text: "Je préfère plutôt :",
        choices: ["Les sports physiques", "Les sports 100% numériques", "Les sports de réflexion"]
    },
    {
        text: "Ton sport du futur s'inspire :",
        choices: ["Des jeux anciens", "Des jeux vidéo", "Des sports actuels", "D'une idée totalement nouvelle"]
    },
    {
        text: "Avec qui ?",
        choices: ["Tout seul", "En équipe (mixte et inclusive)","Avec des robots ou IA"]
    },
    {
        text: "Quel niveau d'intensité ?",
        choices: ["Intense et explosive", "Doux"]
    },
    {
        text: "Que préfères-tu ?",
        choices: ["Etre amélioré par la technologie", "Rester 100% naturel"]
    },
    {
        text: "Ton sport utilise :",
        choices: ["Seulement le corps", "Des accessoires (balles, cordes, raquettes...)", "Des technologies (capteurs, lumière...)"]
    },
    {
        text: "Pour toi, qu'est ce qui est le plus important dans le sport ?",
        choices: ["Respect des règles et de l'équité", "Bienveillance et entraide", "Dépassement de soi et engagement", "Créativité et liberté"]
    },
    {
        text: "Quel type de terrain ?",
        choices: ["Dans la nature", "En ville", "Dans un monde virtuel"]
    },
    {
        text: "L'équipement des joueurs ?",
        choices: ["Tenue fun et colorée", "Tenue simple", "Tenue prestigieuse"]
    }
];

function startQuestionnaire() {
    console.log('Starting questionnaire...');
    document.getElementById('concept-container').style.display = 'none';
    document.getElementById('question-container').style.display = 'block';
    document.querySelector('h1').style.display = 'none';
    currentQuestionIndex = 0;
    answers = [];
    showQuestion(currentQuestionIndex);
    music.play();
}

function getPictoPath(questionIndex, choiceIndex) {
    const pictoPaths = {
        0: [ // Q0
            'Pictos/picto_5.png',
            'Pictos/picto_15.png',  
            'Pictos/picto_23.png'
        ],
        1: [ // Q1
            'Pictos/picto_6.png',
            'Pictos/picto_15.png',
            'Pictos/picto_13.png',
            'Pictos/picto_16.png'
        ],
        2: [ // Q2
            'Pictos/picto_14.png',
            'Pictos/picto_17.png',
            'Pictos/picto_4.png'
        ],
        3: [ // Q3
            'Pictos/picto_18.png',
            'Pictos/picto_6.png'
        ],
        4: [ // Q4
            'Pictos/picto_16.png',
            'Pictos/picto_8.png'
        ],
        5: [ // Q5
            'Pictos/picto_14.png',
            'Pictos/picto_19.png',
            'Pictos/picto_15.png'
        ],
        6: [ // Q6
            'Pictos/picto_21.png',
            'Pictos/picto_16.png',
            'Pictos/picto_22.png',
            'Pictos/picto_23.png'
        ],
        7: [ // Q7
            'Pictos/picto_7.png',
            'Pictos/picto_12.png',
            'Pictos/picto_15.png'
        ],
        8: [ // Q8
            'Pictos/picto_6.png',
            'Pictos/picto_10.png',
            'Pictos/picto_9.png'
        ]
    };

    return pictoPaths[questionIndex][choiceIndex];
}

function showQuestion(index) {
    const question = questions[index];
    document.getElementById('current-question').textContent = question.text;
    const choicesDiv = document.getElementById('choices');
    choicesDiv.innerHTML = '';
    
    question.choices.forEach((choice, i) => {
        const container = document.createElement('div');
        container.className = 'choice-container';
        
        const button = document.createElement('button');
        button.className = 'picto-button';
        button.onclick = () => handleAnswer(i);
    
        
        const img = document.createElement('img');
        img.src = getPictoPath(index, i);
        img.alt = choice;
        
        const label = document.createElement('div');
        label.className = 'choice-label';
        label.textContent = choice;
        
        button.appendChild(img);
        container.appendChild(button);
        container.appendChild(label);
        choicesDiv.appendChild(container);
    });
}

async function handleAnswer(choiceIndex) {
    answers[currentQuestionIndex] = questions[currentQuestionIndex].choices[choiceIndex];
    console.log(questions[currentQuestionIndex].choices[choiceIndex]);
    console.log(currentQuestionIndex);
    currentQuestionIndex++;
    console.log(document.getElementById('chargement').innerHTML)



    
    if (currentQuestionIndex < questions.length ) {
        showQuestion(currentQuestionIndex);

;} else {
        showEmptyResults();
        const result = await generateSport();
        updateSportResults(result);
    }
}
async function generateSport() {

        let data={
           answers: answers,
    } 

    return fetch('http://localhost:3000/generate-sport', {
        method: 'POST',
        body: JSON.stringify(data),
/*data: {
    foo: 'bar', // This is the body part
    answers: reponses,
    evolutionCount: evolutionCount
  },*/
        headers: {
            'Content-Type': 'application/json'
  }
    }).then(response => response.json());
}

function showEmptyResults() {
    document.getElementById('question-container').innerHTML = 'Génération en cours...';
    document.getElementById('chargement').src = 'loading.gif';
    console.log('charge');

}

function updateSportResults(result) {
    document.getElementById('chargement').innerHTML = null
    document.getElementById('sport-description').innerHTML = result.description;
    document.getElementById('terrain-description').innerHTML = result.terrain;
    document.getElementById('sport-rules').innerHTML = result.rules;
    document.getElementById('sport-image').src = result.sportImage;
    var audio_2 = new Audio('voixIA_2.mp3');
    audio_2.loop = false;
    audio_2.play();
}

function showSportResults(result) {
    document.getElementById('chargement').style.display = 'none';
    document.getElementById('question-container').style.display = 'none';
    document.getElementById('sport-results').style.display = 'block';
    document.querySelector('h1').style.display = 'none';
    document.getElementById('sport-description').innerHTML = result.description;
    document.getElementById('terrain-description').innerHTML = result.terrain;
    document.getElementById('sport-rules').innerHTML = result.rules;
    document.getElementById('sport-image').src = result.sportImage;
}

function startNewEvolution() {
    currentQuestionIndex = -1;
    answers = [];
    document.getElementById('sport-results').style.display = 'none';
    document.getElementById('concept-container').style.display = 'block';
    document.querySelector('h1').style.display = 'block';
}

function printSport() {
    window.print();
}

function showConcept() {
    var audio_1 = new Audio('voixIA_1.mp3');
    audio_1.loop = false;
    audio_1.play();
    document.getElementById('start-container').style.display = 'none';
    document.getElementById('concept-container').style.display = 'block';
}
