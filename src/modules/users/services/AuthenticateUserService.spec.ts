import AppError from '@shared/errors/AppError'
import FakeUserRepository from '../repositories/fakes/FakeUserRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import AuthenticateUserService from './AuthenticateUserService'
import CreateUserService from './CreateUserService'

let fakeUsersRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {

    beforeEach(() => {
        fakeUsersRepository = new FakeUserRepository();
        fakeHashProvider = new FakeHashProvider()
        createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider
        )
        authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider
        );
    })

    it('should be able to authenticate', async () => {

        const user = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456'
        })

        const response = await authenticateUser.execute({
            email: 'johndoe@gmail.com',
            password: '123456'
        })

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);

    })

    it('should not be able to authenticate with non existing user', async () => {

        const fakeUsersRepository = new FakeUserRepository();
        const fakeHashProvider = new FakeHashProvider()

        const authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider
        );

        await expect(authenticateUser.execute({
            email: 'johndoe@gmail.com',
            password: '123456'
        })).rejects.toBeInstanceOf(AppError);

    })

    it('should not be able to authenticate with wrong password', async () => {

        const fakeUsersRepository = new FakeUserRepository();
        const fakeHashProvider = new FakeHashProvider()

        const createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider
        )

        const authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider
        );

        await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456'
        })

        await expect(authenticateUser.execute({
            email: 'johndoe@gmail.com',
            password: 'wrong-password'
        })).rejects.toBeInstanceOf(AppError);

    })
})
