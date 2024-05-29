import prisma from "../../database/prisma.js";
import jwt from "jsonwebtoken";

const allServicesByStatus = async (serviceListId, status) => {
    return await prisma.typeServiceList.findMany({
        where: {
            status,
            serviceListId
        }
    });
};

const allServicesByStatusAndCity = async (serviceListId, status, requesterCity) => {
    return await prisma.typeServiceList.findMany({
        where: {
            status,
            serviceListId,
            Provider: {
                city: requesterCity
            }
        }
    });
};


export const availableProviders = async (typeServiceId, requesterCity) => {
    const onServices = await allServicesByStatusAndCity(typeServiceId, "ON", requesterCity);
    return onServices; 
};

const getAllService = async (request, response) => {
    try {
        const allServices = await prisma.serviceList.findMany();
        response.send(allServices);
    } catch(error) {
        console.log(error);
        response.status(500).send({ error: 'Erro ao buscar os serviços.' });
    }   
};

const newService = async (request, response) => {
    const tokenJWT = request.headers.authorization;
    const token = tokenJWT.split(" ")[1];    
    
    try {
        const decodedToken = jwt.decode(token);
        const items = request.body;
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
        console.log(error);
        response.status(500).send({ error: 'Erro ao salvar os serviços.' });
    }
};

const findLegalProvider = async (providerId) => {
    const provider = await prisma.providerLegal.findFirst({
        where: {
            providerId
        }
    });

    if (provider) {
        return provider.companyName;
    } else {
        return "Nome da empresa não encontrado";
    }
}

const findPersonalProvider = async (id) => {
    const user = await prisma.providerPersonal.findFirst({
        where: {
            id
        }
    });
    return user.name;
}

const findServiceById = async (request, response) => {
    try {
        const {id} = request.params
        const serviceById = await prisma.serviceList.findFirst({
            where: {
                id: Number(id)
            }
        });
        response.send(serviceById);
    } catch (error) {
        console.log(error)
    }
}

const availableProvidersByService = async (request, response) => {
    try {
        const { service } = request.params;
        const tokenJWT = request.headers.authorization;
        const token = tokenJWT.split(" ")[1];    
        
        const decodedToken = jwt.decode(token);

        const requester = await prisma.requester.findFirst({
            where: {
                id: decodedToken.requesterId
            }
        });
        
        const typeServiceId = await prisma.serviceList.findFirst({
            where: { service }
        });

        if (!typeServiceId) {
            return response.status(404).send({ error: 'Serviço não encontrado.' });
        }

        const providers = await availableProviders(typeServiceId.id, requester.city);

        // Filtra os IDs dos provedores removendo valores nulos ou indefinidos
        const userIds = providers
            .map(item => item.providerId)
            .filter(id => id !== null && id !== undefined);

        if (userIds.length === 0) {
            return response.status(200).send([]);
        }

        const userById = await prisma.provider.findMany({
            where: {
                id: {
                    in: userIds
                }
            }
        });

        const dataReturn = await Promise.all(providers.map(async item => {
            let userName;
            const serviceListItem = item.serviceListId;
            const providerId = item.providerId;
            const user = userById.find(u => u.id === item.providerId);

            if (!user) {
                return { id: item.id, userName: "Usuário não encontrado", city: "", phone: "" };
            }

            if (user.typeProvider === 'personal') {
                userName = await findPersonalProvider(item.providerId);
            } else if (user.typeProvider === 'legal') {
                userName = await findLegalProvider(item.providerId);
            }

            return {
                id: item.id,
                userName: userName || "Nome não encontrado",
                city: user.city,
                phone: user.phone,
                serviceListItem: serviceListItem,
                providerId: providerId
            };
        }));

        response.send(dataReturn);

    } catch (error) {
        console.error(error);
        response.status(500).send({ error: 'Erro ao buscar os provedores disponíveis.' });
    }
};



export default {
    getAllService,
    newService,
    availableProviders,
    availableProvidersByService,
    findServiceById
};
