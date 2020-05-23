import { Request, Response } from 'express'
import { container } from 'tsyringe'

import ListProviderDayAvailabiltyService from '@modules/appointments/services/ListProviderDayAvailabiltyService'

export default class ProviderDayAvailabilityController {
    public async index(request: Request, response: Response): Promise<Response> {
        const { provider_id } = request.params;
        const { day, month, year } = request.query;

        const listProviderDayAvailability = container.resolve(ListProviderDayAvailabiltyService)

        const availability = await listProviderDayAvailability.execute({
            provider_id,
            day: Number(day),
            month: Number(day),
            year: Number(year)
        })

        return response.json(availability)
    }
}



