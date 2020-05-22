import AppError from '@shared/errors/AppError'

import FakeUserRepository from '../repositories/fakes/FakeUserRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'

import CreateUserService from './CreateUserService'

let fakeUsersRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;

let createUser: CreateUserService;

describe('CreateUser', () => {

    beforeEach(() => {
        fakeUsersRepository = new FakeUserRepository();
        fakeHashProvider = new FakeHashProvider()
        fakeCacheProvider = new FakeCacheProvider()
        createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
            fakeCacheProvider
        );
    })

    it('should be able to create a new user', async () => {

        const user = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456'
        })

        expect(user).toHaveProperty('id');
    })

    it('should not be able to create a user with the same email', async () => {

        await createUser.execute({
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
