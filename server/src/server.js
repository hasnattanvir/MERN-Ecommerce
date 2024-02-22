const {serverPost} = require('./secret');
const app = require('./app');
const connectDB = require('./config/db');
const logger = require('./controllers/loggerController');

app.listen(serverPost,async()=>{
    // console.log(`server is sunning at http://localhost:${serverPost}`);
    logger.log('info',`server is sunning at http://localhost:${serverPost}`);
    await connectDB();
})
