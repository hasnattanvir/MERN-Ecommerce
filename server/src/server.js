const {serverPost} = require('./secret');
const app = require('./app');
const connectDB = require('./config/db');
app.listen(serverPost,async()=>{
    console.log(`server is sunning at http://localhost:${serverPost}`);
    await connectDB();
})
