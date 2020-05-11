import AppError from '@shared/errors/AppError'
import FakeUserRepository from '../repositories/fakes/FakeUserRepository'
import FakeUsersTokenRepository from '../repositories/fakes/FakeUserTokenRepository'
import ResetPasswordService from './ResetPasswordService'

let fakeUsersRepository: FakeUserRepository;
let fakeUsersTokenRepository: FakeUsersTokenRepository;
let resetPassword: ResetPasswordService;

describe('SendForgotPasswordEmail', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUserRepository();
        fakeUsersTokenRepository = new FakeUsersTokenRepository();

        resetPassword = new ResetPasswordService(
            fakeUsersRepository,
            fakeUsersTokenRepository
        );
    })

    it('should be able to reset the password', async () => {

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456',
        })

        const { token } = await fakeUsersTokenRepository.generate(user.id)

        await resetPassword.execute({
            token,
            password: 'teste123',
        })

        const updatedUser = await fakeUsersRepository.findById(user.id)

        expect(updatedUser?.password).toBe('teste123');
    })

})
