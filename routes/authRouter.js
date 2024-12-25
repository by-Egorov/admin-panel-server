import Router from 'express'
import { check } from 'express-validator'
import {
  register,
  login,
  userMe,
  users,
  updateUserRole,
  deleteUser
} from '../controllers/authController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = new Router()
router.post(
  '/auth/register',
  [
    check('email', 'Поле email не может быть пустым').notEmpty(),
    check(
      'password',
      'Пароль должен быть больше 4 и меньше 10 символов',
    ).isLength({ min: 4, max: 15 }),
  ],
  register,
)
router.post(
  '/auth/login',
  [
    check('email', 'Поле email не может быть пустым').notEmpty(),
    check(
      'password',
      'Пароль должен быть больше 4 и меньше 10 символов',
    ).isLength({ min: 4, max: 10 }),
  ],
  login,
)
router.post('/user/update', updateUserRole)
router.get('/user/me', authMiddleware, userMe)
router.get('/users', users)
router.delete('/users/:id', deleteUser)

export default router
