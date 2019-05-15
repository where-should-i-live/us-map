module.exports = {
    getCountyData: async (req, res) => {
        const db = req.app.get('db');
        const countyData = await db.get_county_data();
        res.status(200).send(countyData);
    },
    getActiveCounty: async (req, res) => {
        const db = req.app.get('db');
        const {county_id} = req.params;
        let countyArr = await db.get_active_county(county_id);
        let county = countyArr[0];
        res.status(200).send(county);
    }
};