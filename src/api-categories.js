async function afficheCoucou() {
    // Connexion à la bdd et récupération de la bdd categories
    const nano = require('nano')('http://aiolah:6c6p8q20@couchdb-aiolah.alwaysdata.net:5984');
    const dbCategories = nano.db.use("aiolah_castres_au_tresor_categories");

    // Liste des catégories
    async function listeCategories()
    {
        const query = {
            "selector": {}, 
            "fields": [],
        }
        let liste = await dbCategories.find(query);
        return liste;
    }

    //console.log(await listeCategories());

    const express = require("express");
    const app = express();

    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    // app.get('/categories', async (req, res) =>{
    //     // res.sendFile("index.html");
    //     let liste = await listeCategories();
    //     res.json(liste);
    // });
    app.get('/categories', async (req, res) => {
        try {
            const categories = await listeCategories();
            console.log(categories);
            res.json(categories);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
}
module.exports.afficheCoucou = afficheCoucou;