
module.exports = {
    getCountyData: async (req, res) => {
        const db = req.app.get('db');
        const countyData = await db.get_county_data();
        res.status(200).send(countyData);
    },

    standardDeviation: async (req, res) => {
        const db = req.app.get('db');
        const stddev = await db.calculate_std_dev();
        res.status(200).send(stddev[0]);
    },
    
    getActiveCounty: async (req, res) => {
        const db = req.app.get('db');
        const {id} = req.params;
        let countyArr = await db.get_active_county(id);
        let county = countyArr[0];
        res.status(200).send(county);
    },

    checkForSession: (req, res) => {
        console.log(req.session)
        res.status(200).send(req.session)
    }
};