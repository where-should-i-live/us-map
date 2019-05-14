module.exports = {
    getCountyData: async (req, res) => {
        const db = req.app.get('db');
        const countyData = await db.get_county_data();
        res.status(200).send(countyData);
    }
};