const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      accountType,
      image,
      gender,
      dateOfBirth,
      about,
      contactNumber,
    } = req.body;

    // Check for required fields
    if (!name || !email || !password || !accountType) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        accountType,
        image,
        gender,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        about,
        contactNumber,
      },
    });

    // Send back created user without password
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: 'User created successfully',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
