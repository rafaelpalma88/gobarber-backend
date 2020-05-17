
import { startOfHour, isBefore, getHours } from 'date-fns'
import { injectable, inject } from 'tsyringe'

import Appointment from '../infra/typeorm/entities/Appointment'
import IAppointmentsRepository from '../repositories/IAppointmentsRepository'

import AppError from '@shared/errors/AppError'

interface IRequest {
    provider_id: string;
    user_id: string;
    date: Date;
}

@injectable()
class CreateAppointmentService {

    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository
    ) {}

    public async execute({date, provider_id, user_id}: IRequest): Promise<Appointment> {

        const appointmentDate = startOfHour(date);

        console.log('appointmentDate')
        console.log(appointmentDate)
        console.log('appointmentDate')

        if (isBefore(appointmentDate, Date.now())) {
            throw new AppError("You can't schedual an appointment before now")
        }

        if (user_id === provider_id) {
            throw new AppError("You can't schedual an appointment with the same logged user")
        }

        if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
            throw new AppError('You cant schedule an appointment before 8 am after or 5pm')
        }

        const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
            appointmentDate
        );

        if (findAppointmentInSameDate) {
            throw new AppError('This appointment is already booked')
        }

        const appointment = await this.appointmentsRepository.create({
            provider_id,
            user_id,
            date: appointmentDate,
        })


        return appointment;
    }

}

export default CreateAppointmentService;
