import AppError from '@shared/errors/AppError'
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository'
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'
import CreateAppointmentService from './CreateAppointmentService'

let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeAppointmentsRepository: FakeAppointmentRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {

    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentRepository();
        fakeNotificationsRepository = new FakeNotificationsRepository();
        fakeCacheProvider = new FakeCacheProvider();
        createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
            fakeNotificationsRepository,
            fakeCacheProvider
        );
    })

    it('should be able to create a new appointment', async () => {

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        })

        const appointment = await createAppointment.execute({
            date: new Date(2020, 4, 10, 13),
            provider_id: 'provider-id',
            user_id: 'user-id',
        })

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('provider-id');
    })

    it('should not be able to create two appointments on the same time', async () => {

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        })

        const appointmentDate = new Date(2020, 4, 10, 13);

        await createAppointment.execute({
            date: appointmentDate,
            user_id: 'user-id',
            provider_id: 'provider-id'
        })

        await expect(createAppointment.execute({
            date: appointmentDate,
            user_id: 'user-id',
            provider_id: 'provider-id'
        })).rejects.toBeInstanceOf(AppError);
    })

    it('should not be able to create an appointment on a past date', async () => {

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        })

        await expect(createAppointment.execute({
            date: new Date(2020, 4, 10, 11),
            user_id: 'user-id',
            provider_id: 'provider-id'
        })).rejects.toBeInstanceOf(AppError);
    })

    it('should not be able to create an appointment with the provider being the same user logged', async () => {

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        })

        await expect(createAppointment.execute({
            date: new Date(2020, 4, 10, 13),
            user_id: '123456',
            provider_id: '123456'
        })).rejects.toBeInstanceOf(AppError);
    })

    it('should not be able to create an appointment before 8am', async () => {

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        })

        await expect(createAppointment.execute({
            date: new Date(2020, 4, 11, 7),
            user_id: 'user-id',
            provider_id: 'provider-id'
        })).rejects.toBeInstanceOf(AppError);
    })

    it('should not be able to create an appointment after 5pm', async () => {

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        })

        await expect(createAppointment.execute({
            date: new Date(2020, 4, 11, 18),
            user_id: 'user-id',
            provider_id: 'provider-id'
        })).rejects.toBeInstanceOf(AppError);
    })
})
