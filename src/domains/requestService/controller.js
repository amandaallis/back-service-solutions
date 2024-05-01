import prisma from "../../database/prisma.js";
import {availableProviders} from "../serviceType/controller"

const availableProvidersByService = async (request, response) => {
    try {
        console.log("Entrou")
        const {service} = request.params
        const typeServiceId = await prisma.serviceList.findFirst({
            where: {
                service
            }
        })
        console.log("Chegou aqui para pegar o type service id")
        serviceType.availableProviders(typeServiceId)

    } catch(error) {
        console.log(error)
    }
}

export default {
    availableProvidersByService
}