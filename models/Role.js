import mongoose from 'mongoose'

const RoleSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      unique: true,
      required: true, // Роль должна быть обязательно указана
      enum: ['USER', 'ADMIN', 'MANAGER'], // Ограничиваем значения
      default: 'USER', // Значение по умолчанию
    },
  },
  {
    timestamps: true, // Добавляет createdAt и updatedAt
  },
)

export default mongoose.model('Role', RoleSchema)
