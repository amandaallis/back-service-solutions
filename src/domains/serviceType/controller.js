import prisma from "../../database/prisma.js";

const getAllService = async (request, response) => {
    try {
        return await prisma.service_list.findFirst()
    } catch(error) {
        console.log(error)
    }   
}

export default {
    getAllService
}