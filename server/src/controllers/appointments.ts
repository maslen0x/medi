import { Response } from 'express'

import { IUserRequest } from '../models/User'
import Hospital from '../models/Hospital'
import Service from '../models/Service'
import Appointment from '../models/Appointment'

import getAppointments from '../services/getAppointments'

import errorHandler from '../utils/errorHandler'
import createError from '../utils/createError'
import getUniqueIds from '../utils/getUniqueIds'
import updateData from '../utils/updateData'

import { HTTPStatusCodes } from '../types'

class Controller {
  async create(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const { name, date, phone, service: serviceId } = req.body

      if(!name || !date || !phone || !serviceId) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Заполните все поля')
      }

      const service = await Service.findById(serviceId)
      const services = await Service.find({ category: service.category, hospital: service.hospital })
      const servicesIds = getUniqueIds(services)

      const existingAppointment = await Appointment.findOne({ date, service: { $in: servicesIds } })
      if(existingAppointment) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Данное время занято')
      }

      const appointmentsByHospital = services.map(service => service.appointedDates).flat()
      if(appointmentsByHospital.find(appointedDate => appointedDate.toJSON() === new Date(date).toJSON())) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Данное время занято')
      }

      const appointment = await Appointment.create({
        name,
        date,
        phone,
        service: serviceId
      })

      const result = { ...appointment._doc, service }

      return res
        .status(HTTPStatusCodes.Created)
        .json({ message: 'Вы успешно записались', appointment: result })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }

  async getByHospital(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const appointments = await getAppointments(req)
      return res.json({ appointments })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }

  async getByServiceAndDate(req: IUserRequest, res: Response) {
    try {
      const { serviceId, date } = req.query

      if(!(typeof serviceId === 'string' && typeof date === 'string')) {
        return errorHandler(res)
      }

      const appointment = await Appointment.findOne({ service: serviceId, date: new Date(date) })

      if(!appointment) {
        return errorHandler(res, HTTPStatusCodes.NotFound, 'Запись не найдена')
      }

      return res.json({ appointment })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }

  async getNotSeen(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const appointments = await getAppointments(req, { seen: false })
      return res.json({ appointments })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }

  async setSeen(req: IUserRequest, res: Response) {
    try {
      const hospital = await Hospital.findOne({ user: req.user._id })

      const appointment = await Appointment.findById(req.params.id)
      const service = await Service.findById(appointment.service)

      if(hospital._id.toString() !== service.hospital.toString()) {
        return errorHandler(res, HTTPStatusCodes.Forbidden, 'Недостаточно прав')
      }

      appointment.seen = true
      await appointment.save()

      return res.json({ message: 'Записи успешно обновлены' })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }

  async update(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const { id } = req.params

      const appointment = await Appointment.findById(id)
      if(!appointment) {
        return errorHandler(res, HTTPStatusCodes.NotFound, 'Запись не найдена')
      }

      const hospital = await Hospital.findOne({ user: req.user._id })
      const hospitalId = hospital._id.toString()

      const appointmentService = await Service.findById(appointment.service)
      if(appointmentService.hospital.toString() !== hospitalId) {
        return errorHandler(res, HTTPStatusCodes.Forbidden, 'Недостаточно прав')
      }

      const { name, phone, date, service } = req.body

      const hospitalService = await Service.findById(service)
      if(hospitalService.hospital.toString() !== hospitalId) {
        return errorHandler(res, HTTPStatusCodes.Forbidden, 'Недостаточно прав')
      }

      const services = await Service.find({ category: hospitalService.category, hospital: hospital._id })
      const servicesIds = getUniqueIds(services)

      const existingAppointment = await Appointment.findOne({ date, service: { $in: servicesIds } })
      if(existingAppointment && existingAppointment._id.toString() !== id) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Данное время занято')
      }

      const appointmentsByHospital = services.map(service => service.appointedDates).flat()
      if(appointmentsByHospital.find(appointedDate => appointedDate.toJSON() === new Date(date).toJSON())) {
        return errorHandler(res, HTTPStatusCodes.BadRequest, 'Данное время занято')
      }

      updateData(appointment, { name, phone, date, service })
      await appointment.save()

      const result = {
        ...appointment._doc,
        service: hospitalService
      }

      return res.json({ message: 'Запись успешно изменена', appointment: result })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }

  async remove(req: IUserRequest, res: Response): Promise<Response> {
    try {
      const { id } = req.params

      const appointment = await Appointment.findById(id)
      if(!appointment) {
        return errorHandler(res, HTTPStatusCodes.NotFound, 'Запись не найдена')
      }

      const hospital = await Hospital.findOne({ user: req.user._id })
      const service = await Service.findById(appointment.service)
      if(service.hospital.toString() !== hospital._id.toString()) {
        return errorHandler(res, HTTPStatusCodes.Forbidden, 'Недостаточно прав')
      }

      appointment.deleted = true
      await appointment.save()

      return res.json({ message: 'Запись успешно удалена' })
    } catch (e) {
      console.log(e)
      await createError(e)
      return errorHandler(res)
    }
  }
}

export default new Controller()