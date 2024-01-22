let apiCategories = require('./api-categories');
let apiLieux = require('./api-lieux');

const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

console.log("Yo !");

// Connexion à la bdd et récupération de la bdd categories
const nano = require('nano')('http://aiolah:6c6p8q20@couchdb-aiolah.alwaysdata.net:5984');
const nano2 = require('nano')('http://aiolah_calia:Fire_horse84@couchdb-aiolah.alwaysdata.net:5984');
const nano3 = require('nano')('http://aiolah_jules:acfj-CaStReSaUtReSoR-2023!!!@couchdb-aiolah.alwaysdata.net:5984');
const dbCategories = nano.db.use("aiolah_castres_au_tresor_categories");
const dbLieux = nano2.db.use("aiolah_castres_au_tresor_lieux");
const dbUtil = nano2.db.use("aiolah_castres_au_tresor_utilisateurs");

//=====================================================================================================================================================

// Liste des catégories
async function listeCategories() {
    const query = {
        "selector": {},
        "fields": [],
    }
    let liste = await dbCategories.find(query);
    return liste;
}

app.get('/categories', async (req, res) => {
    try {
        const categories = await listeCategories();
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//=====================================================================================================================================================

// Liste des lieux
async function listeLieux() {

    const query = {
        "selector": {},
        "fields": [],
    };
    let liste = await dbLieux.find(query);
    console.log("Liste des lieux récupérée :", liste); // Ajout d'un log pour vérification
    return liste;
}

app.get('/lieux', async (req, res) => {
    try {
        const lieux = await listeLieux();
        res.json(lieux);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//=====================================================================================================================================================

// Fonction pour trouver un lieu mystère spécifique par idLieu
async function lieuxMystereById(idLieu) {
    const query = {
        "selector": {
            "idLieu": idLieu // Utilisation de idLieu pour trouver le lieu mystère spécifique
        },
        "fields": [],
    }
    let liste = await dbLieux.find(query);
    return liste.docs[0];
}

app.get('/lieu/:idLieu', async (req, res) => {
    const lieuId = req.params.idLieu;
    try {
        const lieumystere = await lieuxMystereById(lieuId);
        res.json(lieumystere);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//=====================================================================================================================================================

// Liste des lieux pour une catégorie passée en paramètre
async function listeLieuxFromCategorie(idCategorie) {

    const query = {
        "selector": { "idCategorie": idCategorie },
        "fields": [],
    };
    let liste = await dbLieux.find(query);
    console.log("Liste des lieux récupérée :", liste); // Ajout d'un log pour vérification
    return liste;
}

app.get('/lieux/:idCategorie', async (req, res) => {
    try {
        const lieux = await listeLieuxFromCategorie(req.params.idCategorie);
        res.json(lieux);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//=====================================================================================================================================================

// Fonction pour trouver un lieu découvert spécifique par idLieu
async function lieuxDecouvertById(idLieu) {
    const query = {
        "selector": {
            "idLieu": idLieu // Utilisation de idLieu pour trouver le lieu mystère spécifique
        },
        "fields": [],
    }
    let liste = await dbLieux.find(query);
    return liste.docs[0];
}

app.get('/lieudecouvert/:idLieu', async (req, res) => {
    const lieuId = req.params.idLieu;
    try {
        const lieudecouvert = await lieuxDecouvertById(lieuId);
        res.json(lieudecouvert);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//=====================================================================================================================================================

// Fonctions liées aux utilisateurs

// Récupération de la liste des utilisateur
// Seulement utile pour les tests

async function listeUtilisateurs() {
    const query = {
        "selector": {},
        "fields": [],
    }
    let liste = await dbUtil.find(query);
    return liste;
}

app.get('/utilisateurs', async (req, res) => {
    try {
        const utilisateurs = await listeUtilisateurs();
        res.json(utilisateurs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Récupération d'un utilisateur spécifique

async function utilisateurSpe(idUtil) {
    const query = {
        "selector": {
            "idUtil": idUtil
        },
        "fields": []
    }
    let speUtil = await dbUtil.find(query);
    return speUtil.docs[0];
}

app.get('/utilisateurs/:idUtil', async (req, res) => {
    const UtilId = req.params.idUtil;
    try {
        const utilspe = await utilisateurSpe(UtilId);
        res.json(utilspe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Création d'un utilisateur dans BDD

app.post('/utilisateurs', async (req, res) => {
    
    const result = req.body;

    if (utilisateurSpe(result.idUtil) == "") {
        await dbUtil.insert(result)
        return res.json({ message: "L'utilisateur a été ajouté" })
    } else {
        return res.json({ message: "L'utilisateur est déjà ajouté" })
    }
});

// Route de test

app.post('/utilisateursobligatoire', async (req, res) => {
    
    const result = req.body;

    // if (utilisateurSpe(result.idUtil) == "") {
    //     return res.json({ message: "L'utilisateur est déjà ajouté" })
    // } else {
        await dbUtil.insert(result)
        return res.json({ message: "L'utilisateur a été ajouté" })
    // }
});

// Modification d'un utilisateur dans la BDD

app.put('/utilisateurs/:idUtil', async (req, res) => {

    // Récupération de l'Id Utilisateur passé en paramètre

    const idUtil = req.params.idUtil;
    const result = req.body;

    const query = {
        "selector": { "idUtil": idUtil },
        "fields": ["_id", "_rev"]
    }

    let utilspe = await dbUtil.find(query);

    if (utilspe.docs.length !== 0) {
        let id = utilspe.docs[0]._id;
        let rev = utilspe.docs[0]._rev;

        if (result) {

            result._id = id;
            result._rev = rev;

            await dbUtil.insert(result)
            return res.json({ message: "L'utilisateur à été modifié" })
        } else {
            return res.json({ message: "Le body est vide" });
        }
    } else {
        return res.json({ message: `L'utilisateur ayant l'id ${idUtil} n'existe pas, il ne peut être modifié.` })
    }
}
);

//=====================================================================================================================================================


app.all("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
});

const port = 3030;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
