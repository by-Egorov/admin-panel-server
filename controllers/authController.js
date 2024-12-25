import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'
import User from '../models/User.js'
import Role from '../models/Role.js'

//Generate jwt token
const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles,
  }
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '24h' })
}

//Register
export const register = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Ошибка при регистрации', errors })
    }
    const { email, password } = req.body
    const salt = await bcrypt.genSalt(7)
    const hash = await bcrypt.hash(password, salt)

    const userRole = await Role.findOne({ value: 'USER' })
    if (!userRole) {
      return res
        .status(500)
        .json({ message: `Роль ${userRole.value} не найдена` })
    }
    const doc = new User({
      email: email,
      passwordHash: hash,
      roles: userRole.value,
    })
    const user = await doc.save()
    const { passwordHash, ...userData } = user._doc
    res.json({
      ...userData,
    })
    console.log(user)
  } catch (e) {
    console.log(e)
    res.status(400).json({
      message: 'Registration error',
    })
  }
}

//Login
export const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res
        .status(400)
        .json({ message: 'Пользователь с таким email не найден' })
    }
    if (user.email !== req.body.email) {
      return res
        .status(409)
        .json({ message: 'Не верные данные, повторите ввод' })
    }
    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash,
    )
    if (!isValidPass) {
      return res.status(401).json({ message: 'Введен неверный пароль' })
    }
    const token = generateAccessToken(user._id, user.roles)
    const { passwordHash, ...userData } = user._doc
    res.json({
      ...userData,
      token,
    })
  } catch (e) {
    console.log(e)
    res.status(400).json({
      message: 'Login error',
    })
  }
}

// User
export const userMe = async (req, res) => {
  const userId = req.user.id
  console.log(userId)

  try {
    const user = await User.findById(userId)
    return res.json({ user })
  } catch (e) {
    console.log(e)
    res.status(400).json({
      message: 'Get User error',
    })
  }
}

//Users
export const users = async (req, res) => {
  try {
    const users = await User.find()
    res.json({ users })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: 'Get Users error',
    })
  }
}

// Update
export const updateUserRole = async (req, res) => {
  try {
    const { userId, ...updateData } = req.body // Извлекаем userId и остальные данные для обновления

    if (!userId) {
      return res.status(400).json({ message: 'ID пользователя не указан' })
    }

    // Обновляем только указанные поля
    const updatedUser = await User.findByIdAndUpdate(
      userId, // ID пользователя
      updateData, // Данные для обновления
      { new: true }, // Возвращаем обновлённый документ
    )

    if (!updatedUser) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    res.status(200).json({
      message: 'Статус пользователя успешно обновлен',
      user: updatedUser,
    })
  } catch (err) {
    console.error('Ошибка при обновлении данных пользователя:', err.message)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
}
// Delete
export const deleteUser = async (req, res) => {
  const { id } = req.params
  console.log(id);
  
  try {
    const deletedUser = await User.findByIdAndDelete(id)

    console.log(deleteUser)
    if (!deletedUser) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }
    res.status(200).json({ message: 'Пользователь удален', user: deletedUser })
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
}
