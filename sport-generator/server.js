const express = require('express');
const OpenAI = require('openai');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const openai = new OpenAI({
    apiKey:process.env.OPENAI_API_KEY 
    //process.env.OPENAI_API_KEY
});

var sportCompletion = "";


//console.log(process.env.OPENAI_API_KEY)
app.post('/generate-sport', async (req, res) => {
    console.log(req.body);
    const { answers } = req.body;
    var prompt_1 =`Tu es une intelligence artificielle médiatrice utilisée dans le cadre d’un dispositif participatif du Musée National du Sport.Ta mission est de permettre aux visiteurs d’inventer le sport de demain de manière collective, citoyenne et évolutive.Chaque visiteur contribue à faire évoluer un sport imaginaire à travers ses réponses.Tu dois analyser les réponses, générer un nouveau sport, et produire une image immersive qui illustre ce sport.Ta tâche à chaque nouveau visiteur : Prends en compte les réponses du visiteur aux 9 réponses suivantes: ${JSON.stringify(answers)}.Fusionne ces réponses avec les choix et les règles des visiteurs précédents.Crée une nouvelle version du sport (concept, valeurs, règles, ambiance). Nomme le sport.Génère les règles du jeu (nombre de joueurs, consignes, but du jeu) (texte clair et concis en francais).Génère ensuite une image du terrain du sport schématisé dans un chat différent.
                Génère ensuite une image qui représente le sport (terrain, joueurs en action, ambiance) dans un autre chat`;
        
        console.log(prompt_1)
    try {
        // gen sport
        const sportCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "user",
                content: prompt_1
            }]
            
        });
    description = sportCompletion.choices[0].message.content;
    var prompt_2 = `Schéma du terrain du sport : ${JSON.stringify(description)} en noir et blanc, vue du dessus, style technique et simple`;
    var prompt_3 = `Illustration du sport:${JSON.stringify(description)} en action, style semi-réaliste et immersif`;  

        // gen schema
        const schemaImage = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt_2,
            size: "1024x1024"
        });
        

        // gen illustration
        const sportImage = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt_3,
            size: "1024x1024"
        });

        res.json({
            description,
            schemaImage: schemaImage.data[0].url,
            sportImage: sportImage.data[0].url
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Erreur de génération' });
    }
});

app.listen(port, () => {
    console.log(`Serveur actif sur http://localhost:${port}`);
});
