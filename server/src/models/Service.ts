import { model, Schema, Document, Types } from 'mongoose'

const { ObjectId } = Types

export interface IService {
  _doc?: IService
  _id?: string
  name: string
  price: number
  hospital: string
  category: string
  appointedDates: Date[]
  deleted: boolean
}

const schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  hospital: { type: ObjectId, ref: 'Hospitals', required: true },
  category: { type: ObjectId, ref: 'Categories', required: true },
  appointedDates: { type: [Date] },
  deleted: { type: Boolean, default: false }
}, {
  timestamps: true
})

export default model<IService & Document>('Services', schema)