const { db } = require('../config/database');

// CREATE - Add a new user
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, age } = req.body;

    // Validation: Check if name and email are provided
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are mandatory fields'
      });
    }

    // Validation: Check if age is a number (if provided)
    if (age !== undefined && (isNaN(age) || age < 0)) {
      return res.status(400).json({
        success: false,
        message: 'Age must be a valid positive number'
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Insert user using query builder
    const [insertId] = await db('users')
      .insert({
        name,
        email,
        age: age || null
      });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: insertId,
        name,
        email,
        age: age || null
      }
    });
  } catch (error) {
    // Handle duplicate email error
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }
    next(error);
  }
};

// READ - Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await db('users')
      .select('id', 'name', 'email', 'age', 'role', 'created_at')
      .orderBy('created_at', 'desc');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// READ - Get user by ID
exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validation: Check if ID is a number
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    const user = await db('users')
      .select('id', 'name', 'email', 'age', 'role', 'created_at')
      .where({ id })
      .first();

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE - Update user details
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, age } = req.body;

    // Validation: Check if ID is a number
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    // Users can only update their own profile (unless admin)
    if (req.user.id !== parseInt(id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this user'
      });
    }

    // Check if at least one field is provided for update
    if (!name && !email && age === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one field to update'
      });
    }

    // Validation: Check if age is a number
    if (age !== undefined && (isNaN(age) || age < 0)) {
      return res.status(400).json({
        success: false,
        message: 'Age must be a valid positive number'
      });
    }

    // Email format validation
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
      }
    }

    // Check if user exists
    const existingUser = await db('users')
      .where({ id })
      .first();

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Build update object dynamically
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (age !== undefined) updateData.age = age;

    // Update user
    await db('users')
      .where({ id })
      .update(updateData);

    // Fetch updated user
    const updatedUser = await db('users')
      .select('id', 'name', 'email', 'age', 'role', 'created_at')
      .where({ id })
      .first();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    // Handle duplicate email error
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }
    next(error);
  }
};

// DELETE - Delete a user
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validation: Check if ID is a number
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    // Users can only delete their own account (unless admin)
    if (req.user.id !== parseInt(id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this user'
      });
    }

    // Check if user exists
    const existingUser = await db('users')
      .where({ id })
      .first();

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete user
    await db('users')
      .where({ id })
      .del();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};