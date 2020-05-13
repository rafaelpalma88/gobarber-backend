import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '../repositories/fakes/FakeUserRepository'
import ShowProfileService from './ShowProfileService'

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('UpdateProfile', () => {

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();

        showProfile = new ShowProfileService(
            fakeUsersRepository
        )
    })

    it('should be able to show the profile', async () => {

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456'
        })

        const profile = await showProfile.execute({
            user_id: user.id
        })

        expect(profile.name).toBe('John Doe');
        expect(profile.email).toBe('johndoe@gmail.com');
    })

    it('should be not able to show the profile if user not exists', async () => {

        expect(showProfile.execute({
            user_id: 'not-existant-id'
        })).rejects.toBeInstanceOf(AppError)

    })

})
