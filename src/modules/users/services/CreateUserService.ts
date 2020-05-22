import { injectable, inject } from 'tsyringe'

import User from '../infra/typeorm/entities/User'
import IUsersRepository from '../repositories/IUsersRepository'
import AppError from '@shared/errors/AppError'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'
import ICachedProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'

interface IRequest {
    name: string;
    email: string;
    password: string;
}

@injectable()
class CreateUserService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,

        @inject('CacheProvider')
        private cacheProvider: ICachedProvider
    ) {}

    public async execute({name, email, password}: IRequest): Promise<User> {

        const checkUserExists = await this.usersRepository.findByEmail(email)

        if (checkUserExists) {
            throw new AppError('Email address already used')
        }

        const hashedPassword = await this.hashProvider.generateHash(password);

        const user = this.usersRepository.create({
            name,
            email,
            password: hashedPassword
        })

        await this.cacheProvider.invalidatePrefix('providers-list')

        return user;
    }

}

export default CreateUserService;
