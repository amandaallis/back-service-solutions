import { response } from 'express';
import prisma from '../../database/prisma.js';
import requesterController from '../requester/controller.js';

//Aqui vai ser pro cliente solicitar o serviço
const newRequiredService = async (request, response) => {
    console.log("New Required Service")
    try {
        const { typeServiceId, description, providerId, street, number, district, city, cep } = request.body;
        console.log("Entrou aqui no required service")
        console.log(typeServiceId)
        const tokenJWT = request.headers.authorization;
        console.log(tokenJWT)
        const requestedId = requesterController.getIdByRequester(tokenJWT);
        console.log("requestedId")
        console.log(requestedId)
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
        console.log(situation);
        
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
        const providerId = requesterController.getIdByRequester(tokenJWT);
        console.log(tokenJWT);
        console.log(providerId);

        const allSolicitations = await prisma.requiredServices.findMany({
            where: {
                providerId: providerId
            }
        });

        console.log("OLHA O ALL SOLICITATIONS", allSolicitations);

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
                    city: adress.city,
                    phone: requester.phone,
                    providerId: providerId,
                    serviceId: item.id
                };
            }));

            console.log("OLHA O DATA", data);

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
