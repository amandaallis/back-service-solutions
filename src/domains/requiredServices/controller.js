import { response } from 'express';
import prisma from '../../database/prisma.js';
import requesterController from '../requester/controller.js';
import providerController from '../provider/controller.js';

//Aqui vai ser pro cliente solicitar o serviço
const newRequiredService = async (request, response) => {
    try {
        const { typeServiceId, description, providerId, street, number, district, city, cep } = request.body;
        const tokenJWT = request.headers.authorization;
        const requestedId = requesterController.getIdByRequester(tokenJWT)
        const requestedData = new Date();
        const statusRequiredService = "OPEN";

        await prisma.requiredServices.create({
            data: {
             //   TypeServiceList: { connect: { id: Number(typeServiceId) } },
                ServiceList: { connect: { id: Number(typeServiceId) } },
                Provider: { connect: { id: Number(providerId) } },
                Requester: { connect: { id: requestedId } },
                description,
                adress: {
                    create: {
                        street,
                        number,
                        district,
                        city,
                        cep
                    }
                },
                requestedData,
                statusRequiredService
            }
        });

        return response.status(200).json();

    } catch (error) {
        console.log(error);
        return response.status(500).json({ error: "Internal server error" });
    }
}

const listMySolicitations = async (request, response) => {
    try {
        const tokenJWT = request.headers.authorization;
        const requestedId = requesterController.getIdByRequester(tokenJWT);
        const mySolicitations = await prisma.requiredServices.findMany({
            where: {
                requesterId: requestedId
            }
        })
        return response.status(200).json(mySolicitations);

    } catch (error) {
        console.log(error)
    }
}

const listMySolicitationsByStatus = async (request, response) => {
    try {
        const tokenJWT = request.headers.authorization;
        const situation = request.params.status;
        const requestedId = requesterController.getIdByRequester(tokenJWT);
        
        const mySolicitations = await prisma.requiredServices.findMany({
            where: {
                statusRequiredService: situation,
                requesterId: requestedId
            }
        });

        if (mySolicitations !== null) {
            return response.status(200).json(mySolicitations);
        } else {
            return response.status(200).json([]);
        }
    } catch (error) {
        console.log(error);
        return response.status(500).json({ error: "Internal server error" });
    }
}

const listSolicitationByProvider = async (request, response) => {
    try {
        const tokenJWT = request.headers.authorization;
        const providerId = providerController.getIdByProvider(tokenJWT);

        const allSolicitations = await prisma.requiredServices.findMany({
            where: {
                providerId: providerId
            }
        });

        if (allSolicitations && allSolicitations.length > 0) {
            const data = await Promise.all(allSolicitations.map(async(item) => {
                const [typeService, requester, adress] = await Promise.all([
                    prisma.serviceList.findFirst({ where: { id: item.typeServiceId } }),
                    prisma.requester.findFirst({ where: { id: item.requesterId } }),
                    prisma.adress.findFirst({ where: { id: item.adressId } })
                ]);

                return {
                    id: item.id,
                    userName: requester.name,
                    adress: adress,
                    city: adress.city,
                    phone: requester.phone,
                    providerId: providerId,
                    serviceId: typeService.id,
                    serviceName: typeService.service,
                    description: item.description
               };
            }));

            return response.status(200).json(data);
        } else {
            return response.status(200).json([]);
        }
    } catch (error) {
        console.log(error);
        return response.status(500).json({ error: "Internal server error" });
    }
}


export default {
    newRequiredService,
    listMySolicitations,
    listMySolicitationsByStatus,
    listSolicitationByProvider
}
