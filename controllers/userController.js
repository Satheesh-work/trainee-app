const { pool } = require('../config/database');

// Add a new user
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

    // Insert user into database
    const query = 'INSERT INTO users (name, email, age) VALUES (?, ?, ?)';
    const [result] = await pool.execute(query, [name, email, age || null]);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: result.insertId,
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

// Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const query = 'SELECT id, name, email, age, role, created_at FROM users ORDER BY created_at DESC';
    const [users] = await pool.execute(query);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
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

    const query = 'SELECT id, name, email, age, role, created_at FROM users WHERE id = ?';
    const [users] = await pool.execute(query, [id]);

    // Check if user exists
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    next(error);
  }
};

// Update user details
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, age } = req.body;

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

    if (!name && !email && age === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one field to update'
      });
    }

    if (age !== undefined && (isNaN(age) || age < 0)) {
      return res.status(400).json({
        success: false,
        message: 'Age must be a valid positive number'
      });
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
      }
    }

    const checkQuery = 'SELECT * FROM users WHERE id = ?';
    const [existingUsers] = await pool.execute(checkQuery, [id]);

    if (existingUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const updates = [];
    const values = [];

    if (name) {
      updates.push('name = ?');
      values.push(name);
    }
    if (email) {
      updates.push('email = ?');
      values.push(email);
    }
    if (age !== undefined) {
      updates.push('age = ?');
      values.push(age);
    }

    values.push(id);

    const updateQuery = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    await pool.execute(updateQuery, values);

    const [updatedUsers] = await pool.execute(
      'SELECT id, name, email, age, role, created_at FROM users WHERE id = ?',
      [id]
    );

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUsers[0]
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }
    next(error);
  }
};

// Delete a user
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

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

    const checkQuery = 'SELECT * FROM users WHERE id = ?';
    const [existingUsers] = await pool.execute(checkQuery, [id]);

    if (existingUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const deleteQuery = 'DELETE FROM users WHERE id = ?';
    await pool.execute(deleteQuery, [id]);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};