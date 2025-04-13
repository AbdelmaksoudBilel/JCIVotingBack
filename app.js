const express = require('express');
const dotenv = require('dotenv')
const cors = require('cors')
const app = express();
const voteRouter = require("./routes/vote.route")

dotenv.config()

app.use(cors())

app.use(express.json());

app.use('/api/', voteRouter);

app.listen(3000, () => {
    console.log(`Server is listening on port 3000`);
});

module.exports = app;