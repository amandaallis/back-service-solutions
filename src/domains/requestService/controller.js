import prisma from "../../database/prisma.js";
import {availableProviders} from "../serviceType/controller"

const availableProvidersByService = async (request, response) => {
    try {
        const {service} = request.params
        const typeServiceId = await prisma.serviceList.findFirst({
            where: {
                service
            }
        })
        serviceType.availableProviders(typeServiceId)

    } catch(error) {
        console.log(error)
    }
}

export default {
    availableProvidersByService
}