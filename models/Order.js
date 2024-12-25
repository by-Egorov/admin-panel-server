import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // Ссылка на пользователя
    ref: 'User', // Связь с коллекцией пользователей
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId, // Ссылка на товар
        ref: 'Product', // Связь с коллекцией товаров
        required: true,
      },
      quantity: {
        // Количество
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  totalAmount: {
    // Общая сумма заказа
    type: Number,
    required: true,
  },
  status: {
    // Статус заказа
    type: String,
    enum: ['new', 'processing', 'completed', 'cancelled'], // Ограниченные значения статуса
    default: 'new',
  },
  createdAt: {
    // Дата создания
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    // Дата обновления
    type: Date,
    default: Date.now,
  },
})

orderSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

export default mongoose.model('Order', orderSchema)
