import { z } from "zod";
import prisma from "../../database/prisma.js";
import { loginSchema, providerLegalSchema, providerPersonal, userSchema, userUpdateSchema } from "./validators.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerNewProvider = async (request, response) => {
    try {
        console.log('====================================');
        console.log("Entrou");
        console.log('====================================');
        const type = request.query.type
        console.log(type);

//        const { email, phone, password } = userSchema.parse(request.body);
        const { email, phone, password } = request.body;

        console.log('====================================');
        console.log(email, phone, password);
        console.log('====================================');
        const existEmailRegistered = await findProviderByEmail(email);
        const existPhoneRegistered = await findProviderByPhone(phone)
        
        if (existEmailRegistered) {
            return response.status(401).json({ error: 'E-mail already registered.' });
        }

        if(existPhoneRegistered) {
            return response.status(401).json({ error: 'Phone already registered.' });
        }

        let newProvider;

        if (type === "personal") {
            const { cpf, name } = providerPersonal.parse(request.body);

            const hashedPassword = bcrypt.hashSync(password, 15);

            newProvider = await prisma.provider.create({
                data: {
                    email,
                    phone,
                    password: hashedPassword,
                    providerPersonal: {
                        create: {
                            name,
                            cpf
                        }
                    }
                },
                include: {
                    providerPersonal: true
                }
            });
        } else if (type === "legal") {
            console.log("Chegou nessa parte do legal")
//            const { cnpj, companyName } = providerLegalSchema.parse(request.body);
            const { cnpj, companyName } = request.body;
            console.log("passou do zod")
            const hashedPassword = bcrypt.hashSync(password, 15);
            console.log(hashedPassword)

            newProvider = await prisma.provider.create({
                data: {
                    email,
                    phone,
                    password: hashedPassword,
                    providerLegal: {
                        create: {
                            cnpj,
                            companyName
                        }
                    }
                },
                include: {
                    providerLegal: true
                }
            });
        } else {
            return response.status(400).json({ error: 'Invalid provider type.', type });
        }
        
        delete newProvider.password;
        console.log("salvou")

        response.status(201).json({
            newProvider,
        });
    } catch(error) {
        if (error instanceof z.ZodError) {
            return response.status(422).json({
                message: error.errors,
            });
        }
        console.log(error)
        return response.status(500).json({ error: 'Internal server error' });
    }
}

const loginProvider = async (request, response) => {
    try {
//        const {password, phone} = loginSchema.parse(request.body);
        const {password, phone} = request.body;
        console.log({password, phone})

        const provider = await findProviderByPhone(phone);
        console.log(provider)

        if(!provider) {
            return response.status(404).json({ error: 'Wrong data, try again' });
        }

        const isSamePassword = bcrypt.compareSync(password, provider.password);

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
        if (error instanceof z.ZodError) {
            return response.status(422).json({
                message: error.errors,
            });
        }
        console.log(error)
    }
}

const findProviderByEmail = ((email) => prisma.provider.findFirst({
    where: {
        email
    }
}));

const findProviderByPhone = ((phone) => prisma.provider.findFirst({
    where: {
        phone
    }
}))

const emailRegistered = async (request, response) => {
    try {
        const email =  request.query.email;
        
        const exist = await findProviderByEmail(email);
        console.log(exist)
    
        if(exist) {
            return response.status(200).json(true);
        }
        return response.status(200).json(false);
    } catch(err) {
        return response.status(500).json({ error: 'Internal server error' });
    }
}
const phoneRegistered = async (request, response) => {
    try {
        const phone =  request.query.phone;
        
        const exist = await findProviderByPhone(phone);
        console.log(exist)
    
        if(exist) {
            return response.status(200).json(true);
        }
        return response.status(200).json(false);
    } catch(err) {
        return response.status(500).json({ error: 'Internal server error' });
    }
}

const getIdByProvider = (tokenJWT) => {
    const token = tokenJWT.split(" ")[1];    
    const decodedToken = jwt.decode(token);
    if (decodedToken && decodedToken.providerId !== undefined) {
        const providerId = decodedToken.providerId;
        return providerId;
    }
    return;
}

//continuar fazendo updateProviderData
const updateProviderData = async (request, response) => {
    try {
        const {email, password, name, companyName } = userUpdateSchema.parse(request.body);
        const tokenJWT = request.headers.authorization;
        const providerId = getIdByProvider(tokenJWT);

        if (!providerId) {
            return response.status(401).json();
        }
        const type = request.query.type;

        let updatedProvider = {};


        if (email) {
            updatedProvider.email = email;
        }

        if (password) {
            updatedProvider.password = bcrypt.hashSync(password, 15);
        }
        if(name) {
            updatedProvider.name = name;
        }

        if(type == "personal") {
            console.log(name)
            updatedProvider.providerPersonal = {
                update: {
                    where: { providerId: providerId }, // Fornecer a condição de atualização
                    data: {
                    name: updatedProvider.name
                    }
                }
            };
        }

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
const teste = (request, response) => {
    console.log("Entrou")
    return response.status(200).json({error: 'funciona'});
}
export default {
    registerNewProvider,
    loginProvider,
    updateProviderData,
    findProviderByPhone,
    emailRegistered,
    phoneRegistered,
    teste
}