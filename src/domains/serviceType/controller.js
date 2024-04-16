import prisma from "../../database/prisma.js";
import jwt from "jsonwebtoken";

const getAllService = async (request, response) => {
    try {
        const allServices =  await prisma.serviceList.findMany();
        response.send(allServices)
    } catch(error) {
        console.log(error)
    }   
}

const newService = async (request, response) => {
    const tokenJWT = request.headers.authorization;
    const token = tokenJWT.split(" ")[1];    
    
    try {
        const decodedToken = jwt.decode(token);
        const items = request.body;
        console.log("Service")
        console.log(items)

        const providerId = decodedToken.providerId;

        const promises = items.map(item => 
            prisma.typeServiceList.create({
                data: {
                    providerId,
                    serviceListId: item.serviceListId,
                    status: item.status
                }
            })
        );

        const saved = await Promise.all(promises);
        response.send(saved);
    } catch(error) {
        console.log("//////////////////")
        console.log(error);
        response.status(500).send({ error: 'Erro ao salvar os serviços.' });
    }
}

export default {
    getAllService,
    newService
}