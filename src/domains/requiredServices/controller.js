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

const listSolicitationByProviderAndStatus = async (request, response) => {
    try {
        const tokenJWT = request.headers.authorization;
        const providerId = providerController.getIdByProvider(tokenJWT);
        const {status} = request.params

        const allSolicitations = await prisma.requiredServices.findMany({
            where: {
                providerId: providerId,
                statusRequiredService: status
            }
        });
        let statusReturn;
            if(status == "APPROVED") {
                statusReturn =  "Aceito"
            } else if(status == "REJECTED") {
                statusReturn = "Recusado"
            } else {
                statusReturn = "OPEN"
            }

        if (allSolicitations && allSolicitations.length > 0) {
            const data = await Promise.all(allSolicitations.map(async (item) => {
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
                    description: item.description,
                    status: statusReturn
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

const updateSolicitation = async (request, response) => {
    try {
        const { solicitationId } = request.params;
        const { status } = request.params;

        const solicitation = await prisma.requiredServices.findFirst({
            where: {
                id: parseInt(solicitationId)
            }
        });

        if (!solicitation) {
            return response.status(404).json({ message: "Solicitação não encontrada" });
        }

        const updatedSolicitation = await prisma.requiredServices.update({
            where: {
                id: parseInt(solicitationId)
            },
            data: {
                statusRequiredService: status
            }
        });

        return response.status(200).json(updatedSolicitation);
    } catch (error) {
        console.error("Erro ao atualizar a solicitação:", error);
        return response.status(500).json({ message: "Erro interno do servidor" });
    }
};


export default {
    newRequiredService,
    listMySolicitations,
    listMySolicitationsByStatus,
    listSolicitationByProviderAndStatus,
    updateSolicitation
}
