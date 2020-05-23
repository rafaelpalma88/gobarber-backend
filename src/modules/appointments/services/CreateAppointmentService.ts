
import { startOfHour, isBefore, getHours, format } from 'date-fns'
import { injectable, inject } from 'tsyringe'

import AppError from '@shared/errors/AppError'

import Appointment from '../infra/typeorm/entities/Appointment'
import IAppointmentsRepository from '../repositories/IAppointmentsRepository'
import INotificationRepositories from '@modules/notifications/repositories/INotificationRepositories'
import ICachedProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'

interface IRequest {
    provider_id: string;
    user_id: string;
    date: Date;
}

@injectable()
class CreateAppointmentService {

    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,

        @inject('NotificationsRepository')
        private notificationsRepository: INotificationRepositories,

        @inject('CacheProvider')
        private cacheProvider: ICachedProvider,
    ) {}

    public async execute({date, provider_id, user_id}: IRequest): Promise<Appointment> {

        const appointmentDate = startOfHour(date);

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
            appointmentDate,
            provider_id
        );

        if (findAppointmentInSameDate) {
            throw new AppError('This appointment is already booked')
        }

        const appointment = await this.appointmentsRepository.create({
            provider_id,
            user_id,
            date: appointmentDate,
        })

        const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'")

        await this.notificationsRepository.create({
            recipient_id: provider_id,
            content: `Novo agendamento para dia ${dateFormatted}`
        })

        await this.cacheProvider.invalidate(`provider-appointments:${provider_id}:${format(appointmentDate, 'yyyy-M-d')}`)

        return appointment;
    }

}

export default CreateAppointmentService;
