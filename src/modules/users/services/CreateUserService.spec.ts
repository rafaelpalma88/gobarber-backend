import AppError from '@shared/errors/AppError'
import FakeUserRepository from '../repositories/fakes/FakeUserRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import CreateUserService from './CreateUserService'

describe('CreateUser', () => {
    it('should be able to create a new user', async () => {
        const fakeUsersRepository = new FakeUserRepository();
        const fakeHashProvider = new FakeHashProvider()
        const createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider
        );

        const user = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456'
        })

        expect(user).toHaveProperty('id');
    })

    it('should not be able to create a user with the same email', async () => {
        const fakeUsersRepository = new FakeUserRepository();
        const fakeHashProvider = new FakeHashProvider()
        const createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider
        );

        const user = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456'
        })

        await expect(createUser.execute({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456'
        })).rejects.toBeInstanceOf(AppError);

    })


})
