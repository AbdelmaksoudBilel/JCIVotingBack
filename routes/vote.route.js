var express = require('express');
var router = express.Router();
const db = require('../firebaseConfig')

router.post('/', async (req, res) => {

    if (req.method !== "POST") {
        return res.status(400).send("Méthode non autorisée");
    }

    const { code, msg, conter, pour, abstain, rest } = req.body;

    try {

        if (!code) return res.status(400).send("Code requis");

        await db.ref(code).push({
            msg,
            conter,
            pour,
            abstain,
            rest,
            timestamp: Date.now()
        });

        res.status(200).send({ success: true, message: "Vote enregistré !" });
    } catch (error) {
        console.error("Erreur lors de l'enregistrement :", error);
        res.status(500).send({ success: false, message: "Erreur serveur" });
    }
});

router.get('/', async (req, res) => {

    const { code } = req.query;

    try {

        if (!code) return res.status(400).send("Code requis");

        const snapshot = await db.ref(code)
            .orderByChild("timestamp")
            .limitToLast(1)
            .once("value");

        const data = snapshot.val();
        const lastVote = data ? Object.values(data)[0] : null;

        res.status(200).json({
            success: true,
            lastVote: lastVote || {}
        });
    } catch (error) {
        console.error("Erreur:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

router.delete('/', async (req, res) => {

    if (req.method !== "DELETE") {
        return res.status(405).send("Méthode non autorisée");
    }

    const { code } = req.body;

    try {

        if (!code) return res.status(400).send("Code requis");

        await db.ref(code).remove();
        res.status(200).send({ success: true, message: "Tous les votes ont été supprimés." });
    } catch (error) {
        console.error("Erreur de suppression :", error);
        res.status(500).send({ success: false, message: "Erreur lors de la suppression" });
    }
});

router.get('/:code', async (req, res) => {

    try {

        if (!req.params.code) return res.status(400).send("Code requis");

        const snapshot = await db.ref(req.params.code).once("value");
        const exists = snapshot.exists();

        res.status(200).json({ exists });
    } catch (error) {
        console.error("Erreur de vérification :", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

module.exports = router;
