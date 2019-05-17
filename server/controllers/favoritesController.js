module.exports = {
    getFavorites: async (req, res) => {
        const db = req.app.get('db');
        const {id} = req.params;

        let favorites = await db.get_favorites_by_user(id);
        res.status(200).send(favorites);
    },

    addFavorite: async (req, res) => {
        const db = req.app.get('db');
        const {user_id} = req.session.user;
        const {id} = req.params;

        let favorites = await db.add_favorite([user_id, id]);
        res.status(200).send(favorites);
    },

    deleteFavorite: async (req, res) => {
        const db = req.app.get('db');
        const {id} = req.params;
        const {user_id} = req.session.user;

        let favorites = await db.delete_favorite([id, user_id]);
        res.status(200).send(favorites);
    },

    editNote: async(req, res) => {
        const db = req.app.get('db');
        const {user_id} = req.session.user;
        const {favorite_id, favorite_note} = req.body;

        let favorites = await db.edit_note([user_id, favorite_id, favorite_note]);
        res.status(200).send(favorites);
    }
}