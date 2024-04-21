import bcrypt from 'bcrypt';
import prisma from "../../database/prisma.js";
import { loginSchema, userSchema, userUpdateSchema } from './validators.js';
import { z } from 'zod';
import jwt from "jsonwebtoken"

const registerNewRequester = async (request, response) => {
    try {
        const { name, phone, password, email } =  userSchema.parse(request.body);

        const existEmailRegistered = await findRequesterByEmail(email);

        if(existEmailRegistered) {
            if(!email) {
                return response.status(401).json( {error: 'Invalid Email.'});
            }
            return response.status(401).json( {error: 'E-mail already registered.'});
        }

        const existPhoneRegistered = await findRequesterByPhone(phone);
        if(existPhoneRegistered) {
            if(!phone) {
                return response.status(401).json( {error: 'Invalid Phone.'});
            }
            return response.status(401).json( {error: 'Phone already registered.'});
        }

        const hashedPassword = bcrypt.hashSync(password, 15);

        const newRequester = await prisma.requester.create({
            data: {
                name, phone, password: hashedPassword, email
            }
        })
        delete newRequester.password

        response.status(201).json({
            newRequester,
          });

    } catch(error) {
        console.log(error)
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
        const {phone, password} = loginSchema.parse(request.body);
        const requester = await findRequesterByPhone(phone);

        console.log(requester)

        if(!requester) {
            return response.status(404).json({ error: 'Wrong data, try again' });
        }
        const isSamePassword = await bcrypt.compare(password, requester.password);
        
        if(!isSamePassword) {
            return response.status(404).json({ error: 'Wrong data, try again' });
        }
        const token = jwt.sign(
            {
              requesterId: requester.id,
            },
            process.env.SECRET
          );
          console.log("loginn")
          response.json({
            token,
          });
    } catch (error) {
        console.log(error)
    }
}

const emailRegistered = async (request, response) => {
    try {
        const email =  request.query.email;
        
        const exist = await findRequesterByEmail(email);
        console.log(email)
    
        if(exist) {
            return response.status(200).json(true);
        } else {
            return response.status(200).json(false);
        }

    } catch(err) {
        console.log(err)
        return response.status(500).json({ error: 'Internal server error' });
    }
}

const phoneRegistered = async (request, response) => {
    try {
        const phone =  request.query.phone;
        
        const exist = await findRequesterByPhone(phone);
        console.log(exist)
    
        if(exist) {
            return response.status(200).json(true);
        }
        return response.status(200).json(false);
    } catch(err) {
        return response.status(500).json({ error: 'Internal server error' });
    }
}

const findRequesterByEmail = ((email) => prisma.requester.findFirst({
        where: {
            email
        }
}));

const findRequesterByPhone = ((phone) => prisma.requester.findFirst({
    where: {
        phone
    }
}))

export default {
    registerNewRequester,
    findRequesterByEmail,
    loginRequester,
    updateRequesterData,
    emailRegistered,
    phoneRegistered
};