module.exports = {
    afficheCoucou: function () {
        console.log("Coucou");
        //Mise en oeuvre de la connexion
        const nano = require('nano')('http://aiolah_calia:Fire_horse84@couchdb-aiolah.alwaysdata.net:5984');
        const dbLieux = nano.db.use("aiolah_castres_au_tresor_lieux");

        //Liste des lieux mysteres
        async function listeLieux(){
            const query ={
                "selector" : {},
                "fields" : []
            }
            let liste = await dbLieux.find(query)
            console.log(liste)
        }
        listeLieux()
    }

};