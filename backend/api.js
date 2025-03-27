import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cors from 'cors'
import pkg from '@prisma/client'
const { PrismaClient, user_role } = pkg;

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
            token: encryptedUser
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
                role: user_role
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
            token: encryptedUser
        })
    } catch (e) {
        console.error('Error during register', e);
        return res.status(500).json({ message: 'Error during register' });
    }
})

app.get('/api/user-info', authenticateToken, (req, res) => {
  const { role, name, email } = req.user;
  res.json({ role, name, email });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log(token);
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.get('/api/products', async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        return res.status(200).json(products);
    } catch (error) {
        console.error("Error obteniendo el producto", error);
    }
})

app.post('/api/products', async (req, res) => {
    try {
        console.log("POST-PRODUCTS: ", req.body);
        const {
            reference,
            name, 
            price,
            description,
            category,
            onSale,
            stock,
            image,
        } = req.body;
        await prisma.product.create({
            data: {
                reference,
                name,
                price,
                description,
                category,
                onSale,
                stock,
                image
            }
        })
    } catch (error) {
        console.error("Error guardando el producto", error);
    }
})

app.delete('/api/products/:reference', async (req, res) => {
    try {
        const {reference} = req.params;

        await prisma.product.delete({
            where: { 
                reference: reference,
            },
        })
        
        return res.status(201).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        console.error ("Erorr eliminando el producto", error);
        return res.status(500).json({ message: "Error eliminando el producto"})
    }
})
app.post('/api/cart', async (req, res) => {
  const { reference } = req.body;
  const { email } = req.body;

  try {
    // Obtener usuario
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Verificar si existe el producto
    const product = await prisma.product.findUnique({ where: { reference } });
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    // Buscar carrito existente
    let cart = await prisma.cart.findUnique({ where: { userId: user.id } });

    // Crear carrito si no existe
    if (!cart) {
      const expirationDate = new Date(Date.now() + 10 * 60 * 1000);
      cart = await prisma.cart.create({
        data: {
          userId: user.id,
          expirationDate
        }
      });
    }

    // Buscar si el producto ya está en el carrito
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productReference: {
          cartId: cart.id,
          productReference: reference
        }
      }
    });

    // Actualizar o insertar CartItem
    if (existingItem) {
      await prisma.cartItem.update({
        where: {
          cartId_productReference: {
            cartId: cart.id,
            productReference: reference
          }
        },
        data: {
          quantity: { increment: 1 }
        }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productReference: reference,
          quantity: 1
        }
      });
    }

    return res.status(200).json({ message: "Producto añadido al carrito correctamente" });

  } catch (error) {
    console.error("Error al gestionar el carrito:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

app.get('/api/cart/items', authenticateToken, async (req, res) => {
  try {
    const { email } = req.user;

    // Buscar al usuario por email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Buscar el carrito activo del usuario
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
    });

    if (!cart) {
      return res.status(200).json({ items: [] }); // No hay carrito aún
    }

    // Obtener los items del carrito con datos del producto
    const items = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: {
        Product: true,
      },
    });

    return res.status(200).json({ items });

  } catch (error) {
    console.error("Error al obtener los items del carrito", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

app.listen(PORT, () => {
    console.log("Server running on port: ", PORT);
})