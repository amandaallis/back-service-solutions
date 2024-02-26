import bcrypt from 'bcrypt';
import prisma from "../../database/prisma.js";
import { loginSchema, userSchema, userUpdateSchema } from './validators.js';
import  validateCPF  from '../../helpers/validateCPF.js';
import { z } from 'zod';
import jwt from "jsonwebtoken"

const registerNewRequester = async (request, response) => {
    try {
        const { name, rg, cpf, phone, password, email } = userSchema.parse(request.body);

        const existEmailRegistered = await findRequesterByEmail(email);
        
        if(existEmailRegistered) {
            if(!email) {
                return response.status(401).json( {error: 'Invalid Email.'});
            }
            return response.status(401).json( {error: 'E-mail already registered.'});
        }
        if(cpf && !validateCPF(cpf)) {
            return response.status(401).json({error: 'CPF is invalid'})
        }
        const hashedPassword = bcrypt.hashSync(password, 15);

        const newRequester = await prisma.requester.create({
            data: {
                name, email, password: hashedPassword, rg, cpf, phone
            }
        })
        delete newRequester.password
        response.status(201).json({
            newRequester,
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

const updateRequesterData = async (request, response) => {
    try {
        const { name, phone, password } = userUpdateSchema.parse(request.body);
        const tokenJWT = request.headers.authorization;
        const requesterId = getIdByRequester(tokenJWT);

        if (!requesterId) {
            return response.status(401).json();
        }

        let updatedRequester = {};

        if (name) {
            updatedRequester.name = name;
        }

        if (phone) {
            updatedRequester.phone = phone;
        }

        if (password) {
            updatedRequester.password = bcrypt.hashSync(password, 15);
        }

        await prisma.requester.update({
            where: { id: requesterId },
            data: updatedRequester,
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

const getIdByRequester = (tokenJWT) => {
    const token = tokenJWT.split(" ")[1];    
    const decodedToken = jwt.decode(token);
    if (decodedToken && decodedToken.requesterId !== undefined) {
        const requesterId = decodedToken.requesterId;
        return requesterId;
    }
    return;
}

const loginRequester = async (request, response) => {
    try {
        const {email, password} = loginSchema.parse(request.body);
        const requester = await findRequesterByEmail(email);
        if(!requester) {
            return response.status(404).json({ error: 'Wrong data, try again' });
        }
        const isSamePassword = bcrypt.compareSync(password, requester.password);
        if(!isSamePassword) {
            return response.status(404).json({ error: 'Wrong data, try again' });
        }
        const token = jwt.sign(
            {
              requesterId: requester.id,
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

const findRequesterByEmail = ((email) => prisma.requester.findFirst({
        where: {
            email
        }
    }));

export default {
    registerNewRequester,
    findRequesterByEmail,
    loginRequester,
    updateRequesterData
};