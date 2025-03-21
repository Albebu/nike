import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cors from 'cors'
import { PrismaClient, Role } from '@prisma/client'
import { hash } from 'crypto';

const prisma = new PrismaClient();
const app = express();
const PORT = 3000;
const JWT_SECRET = "PitchiMonkey2004_";

app.use(cors());
app.use(express.json());

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await prisma.user.findUnique({
            where: { email }
        })
        if (!user) return res.status(404).json({ message: 'User not found' });

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return res.status(403).json({ message: 'Incorrect credentials' });

        const prepUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }

        const encryptedUser = jwt.sign(prepUser, JWT_SECRET);
        res.status(200).json({ 
            message: 'Authenticated sucsesfully',
            user: encryptedUser
        })
    } catch(e) {
        console.error('Error during login: ', e);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) return res.status(400).json({ message: 'User alredy exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: Role.CUSTOMER
            }
        })

        const user = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        }

        const encryptedUser = jwt.sign(user, JWT_SECRET);

        return res.status(201).json({ 
            message: 'User registered succesfully', 
            user: encryptedUser
        })
    } catch (e) {
        console.error('Error during register', e);
        return res.status(500).json({ message: 'Error during register' });
    }
})

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Denied access' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (e) {
        res.status(403).json({ message: 'Invalid token' });
    }
}

app.listen(PORT, () => {
    console.log("Server running on port: ", PORT);
})