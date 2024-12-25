import mongoose from 'mongoose'

const logSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // ID пользователя, который сделал изменение
    ref: 'User', // Связь с коллекцией "User"
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: ['create', 'update', 'delete'], // Тип действия
  },
  entity: {
    type: String,
    required: true,
    enum: ['product', 'order', 'user', 'category'], // Сущность, над которой произошло действие
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId, // ID изменённой сущности
    required: true,
  },
  changes: {
    type: Object, // Содержит старые и новые значения
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model('Log', logSchema)
