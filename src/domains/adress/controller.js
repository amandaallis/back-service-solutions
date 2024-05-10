import prisma from "../../database/prisma"

const getAdressById = async (id) => {
    try {
        const adress = await prisma.adress.findFirst({
            where: {
                id
            }
        })
    } catch (error) {
        console.log(error)
    }
}
export default {
    getAdressById
}