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

export const availableProviders = async (typeServiceId) => {
    const onServices = await allServicesByStatus(typeServiceId, "ON");
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

const availableProvidersByService = async (request, response) => {
    try {
        const { service } = request.params;

        const typeServiceId = await prisma.serviceList.findFirst({
            where: {
                service
            }
        });

        if (!typeServiceId) {
            return response.status(404).send({ error: 'Serviço não encontrado.' });
        }

        const providers = await availableProviders(typeServiceId.id);

        const userIds = providers.map(item => item.providerId);

        const userById = await prisma.provider.findMany({
            where: {
                id: {
                    in: userIds
                }
            }
        });

        const dataReturn = await Promise.all(providers.map(async item => {
            let userName;
            const user = userById.find(u => u.id === item.providerId);

            console.log("aqui e o id do provider")
            console.log(item.providerId)
            if (!user) {
                return { id: item.id, userName: "Usuário não encontrado", city: "", phone: "" };
            }

            if (user.typeProvider === 'personal') {
                userName = await findPersonalProvider(item.providerId);
            } else if(user.typeProvider === 'legal') {
                userName = await findLegalProvider(item.providerId);
            }

            const data = {
                id: item.id,
                userName: userName,
                city: user.city,
                phone: user.phone
            };

            return data;
        }));

        response.send(dataReturn);

    } catch (error) {
        console.log(error);
        response.status(500).send({ error: 'Erro ao buscar os provedores disponíveis.' });
    }
};

export default {
    getAllService,
    newService,
    availableProviders,
    availableProvidersByService
};
