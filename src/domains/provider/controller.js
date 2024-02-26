import { z } from "zod";
import prisma from "../../database/prisma.js";
import validateCPF from "../../helpers/validateCPF.js";
import { loginSchema, userSchema, userUpdateSchema } from "./validators.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerNewProvider = async (request, response) => {
    try {
        const { name, rg, cpf, phone, password, email } = userSchema.parse(request.body);

        const existEmailRegistered = await findProviderByEmail(email);
        
        if(existEmailRegistered) {
            if(!email) {
                return response.status(401).json( {error: 'Invalid Email.'});
            }
            return response.status(401).json( {error: 'E-mail already registered.'});
        }
        if(cpf && !validateCPF(cpf)) {
            return response.status(401).json({error: 'CPF is invalid'})
        }
        const hashedPassword = bcypt.hashSync(password, 15);

        const newProvider = await prisma.provider.create({
            data: {
                name, email, password: hashedPassword, rg, cpf, phone
            }
        })
        delete newProvider.password
        response.status(201).json({
            newProvider,
          });
    } catch(error) {
        if (error instanceof z.ZodError) {
            return response.status(422).json({
              message: error.errors,
            });
          }
        return response.status(500).json({ error: 'Internal server error' });
    }
}

const loginProvider = async (request, response) => {
    try {
        const {email, password} = loginSchema.parse(request.body);
        const provider = await findProviderByEmail(email);
        if(!provider) {
            return response.status(404).json({ error: 'Wrong data, try again' });
        }
        const isSamePassword = bcypt.compareSync(password, provider.password);
        if(!isSamePassword) {
            return response.status(404).json({ error: 'Wrong data, try again' });
        }
        const token = jwt.sign(
            {
              providerId: provider.id,
            },
            process.env.SECRET
          );
          response.json({
            token,
          });
    } catch (error) {
        console.log(error)
    }
}

const findProviderByEmail = ((email) => prisma.provider.findFirst({
    where: {
        email
    }
}));

const getIdByProvider = (tokenJWT) => {
    const token = tokenJWT.split(" ")[1];    
    const decodedToken = jwt.decode(token);
    if (decodedToken && decodedToken.providerId !== undefined) {
        const providerId = decodedToken.providerId;
        return providerId;
    }
    return;
}

const updateProviderData = async (request, response) => {
    try {
        const { name, phone, password } = userUpdateSchema.parse(request.body);
        const tokenJWT = request.headers.authorization;
        const providerId = getIdByProvider(tokenJWT);

        if (!providerId) {
            return response.status(401).json();
        }

        let updatedProvider = {};

        if (name) {
            updatedProvider.name = name;
        }

        if (phone) {
            updatedProvider.phone = phone;
        }

        if (password) {
            updatedProvider.password = bcrypt.hashSync(password, 15);
        }

        await prisma.provider.update({
            where: { id: providerId },
            data: updatedProvider,
        });

        return response.status(200).json();

    } catch (error) {
        if (error instanceof z.ZodError) {
            return response.status(422).json({
                message: error.errors,
            });
        }
        return response.status(500).json({ error: error.message });
    }
}
export default {
    registerNewProvider,
    loginProvider,
    updateProviderData
}