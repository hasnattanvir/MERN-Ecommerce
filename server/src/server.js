const {serverPort} = require('./secret');
const app = require('./app');
const connectDB = require('./config/db');
const logger = require('./controllers/loggerController');

app.listen(serverPort,async()=>{
    // console.log(`server is sunning at http://localhost:${serverPort}`);
    logger.log('info',`server is sunning at http://localhost:${serverPort}`);
    await connectDB();
})
