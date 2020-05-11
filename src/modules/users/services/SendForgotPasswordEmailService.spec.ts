import AppError from '@shared/errors/AppError'
import FakeUserRepository from '../repositories/fakes/FakeUserRepository'
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider'
import FakeUsersTokenRepository from '../repositories/fakes/FakeUserTokenRepository'
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService'

let fakeUsersRepository: FakeUserRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUsersTokenRepository: FakeUsersTokenRepository;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUserRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeUsersTokenRepository = new FakeUsersTokenRepository();

        sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
            fakeUsersRepository,
            fakeMailProvider,
            fakeUsersTokenRepository
        );
    })

    it('should be able to recover the password using the email', async () => {

        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail')

        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456',
        })

        await sendForgotPasswordEmailService.execute({
            email: 'johndoe@gmail.com',
        })

        expect(sendMail).toHaveBeenCalled();
    })

    it('should be able to recover a non-existing user password', async () => {

        await expect(sendForgotPasswordEmailService.execute({
            email: 'johndoe@gmail.com',
        })).rejects.toBeInstanceOf(AppError);
    })

    it('should generate a forgot password token', async () => {

        const generateToken = jest.spyOn(fakeUsersTokenRepository, 'generate')

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456'
        })

        await sendForgotPasswordEmailService.execute({
            email: 'johndoe@gmail.com',
        })

        expect(generateToken).toHaveBeenCalledWith(user.id);
    })

})
