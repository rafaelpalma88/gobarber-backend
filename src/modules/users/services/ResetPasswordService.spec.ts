import AppError from '@shared/errors/AppError'
import FakeUserRepository from '../repositories/fakes/FakeUserRepository'
import FakeUsersTokenRepository from '../repositories/fakes/FakeUserTokenRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import ResetPasswordService from './ResetPasswordService'

let fakeUsersRepository: FakeUserRepository;
let fakeUsersTokenRepository: FakeUsersTokenRepository;
let resetPassword: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPasswordService', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUserRepository();
        fakeUsersTokenRepository = new FakeUsersTokenRepository();
        fakeHashProvider = new FakeHashProvider();

        resetPassword = new ResetPasswordService(
            fakeUsersRepository,
            fakeUsersTokenRepository,
            fakeHashProvider
        );
    })

    it('should be able to reset the password', async () => {

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456',
        })

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')

        const { token } = await fakeUsersTokenRepository.generate(user.id)

        await resetPassword.execute({
            token,
            password: 'teste123',
        })

        const updatedUser = await fakeUsersRepository.findById(user.id)

        expect(generateHash).toHaveBeenCalled();
        expect(updatedUser?.password).toBe('teste123');
    })

    it('should not be able to reset the password with non-existent token', async () => {

        await expect(resetPassword.execute({
            token: 'non-existing-token',
            password: 'teste123',
        })).rejects.toBeInstanceOf(AppError);
    })

    it('should not be able to reset the password with non-existent user', async () => {

        const { token } = await fakeUsersTokenRepository.generate('non-existing-user')

        await expect(resetPassword.execute({
            token,
            password: 'teste123',
        })).rejects.toBeInstanceOf(AppError);
    })

    it('should not be able to reset the password after two hours after the token had been generated', async () => {

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456',
        })

        const { token } = await fakeUsersTokenRepository.generate(user.id)

        jest.spyOn(Date, 'now').mockImplementation(() => {
            const customDate = new Date();

            return customDate.setHours(customDate.getHours() + 3);
        })

        await expect(resetPassword.execute({
            token,
            password: 'teste123',
        })).rejects.toBeInstanceOf(AppError);
    })

})
