import AppError from '@shared/errors/AppError'
import FakeUsersRepository from '../repositories/fakes/FakeUserRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import UpdateProfileService from './UpdateProfileService'

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        updateProfile = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider
        )
    })

    it('should be able to update user infos', async () => {

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456'
        })

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'John Doe da Silva Sauro',
            email: 'johndoe2@gmail.com'
        })

        expect(updatedUser.name).toBe('John Doe da Silva Sauro');
        expect(updatedUser.email).toBe('johndoe2@gmail.com');
    })

    it('should not be able to update a user if the email was used before', async () => {

        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456'
        })

        const user = await fakeUsersRepository.create({
            name: 'John Doe da Silva Sauro',
            email: 'test@gmail.com',
            password: '123456'
        })

        await expect(updateProfile.execute({
            user_id: user.id,
            name: 'John Doe da Silva Sauro Banana',
            email: 'johndoe@gmail.com',
        })).rejects.toBeInstanceOf(AppError);
    })

    it('should be able to update the password', async () => {

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456'
        })

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            old_password: '123456',
            password: 'teste@123'
        })

        expect(updatedUser.password).toBe('teste@123');
    })

    it('should not be able to update the password without the old password', async () => {

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456'
        })

        expect(updateProfile.execute({
            user_id: user.id,
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: 'teste@123'
        })).rejects.toBeInstanceOf(AppError)
    })

    it('should not be able to update the password if the old password is incorrect', async () => {

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456'
        })

        expect(updateProfile.execute({
            user_id: user.id,
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            old_password: 'wrong-old-password',
            password: 'teste@123'
        })).rejects.toBeInstanceOf(AppError)
    })

})
