import { injectable, inject } from 'tsyringe'

import Appointment from '../infra/typeorm/entities/Appointment'
import IAppointmentsRepository from '../repositories/IAppointmentsRepository'
import ICachedProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'

interface IRequest {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}

@injectable()
class ListProvidersAppointmentService {

    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,

        @inject('CacheProvider')
        private cacheProvider: ICachedProvider,
    ) {}

    public async execute({
        provider_id,
        day,
        year,
        month
    }: IRequest): Promise<Appointment[]> {

        const cachedData = await this.cacheProvider.recover('asd');

        console.log(cachedData)

        const appointments = await this.appointmentsRepository.findAllInDayFromProvider({
            provider_id,
            day,
            year,
            month
        })

        //await this.cacheProvider.save('asd', 'asd')

        return appointments;
    }

}

export default ListProvidersAppointmentService;
