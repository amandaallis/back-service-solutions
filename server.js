import express from 'express';
import requesterRouter from './src/domains/requester/routes.js';
import providerRouter from './src/domains/provider/routes.js'
import serviceTypeRouter from './src/domains/serviceType/routes.js'

const port = 3000;
const server = express();
server.use(express.json());
server.use(requesterRouter);
server.use(providerRouter);
server.use(serviceTypeRouter)

server.listen(port, () => {
    console.log("Server is running on port ", port);
});
