import { getMongoRepository, MongoRepository, Raw } from 'typeorm'

import INotificationRepositories from '@modules/notifications/repositories/INotificationRepositories'
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO'
import Notification from '../schemas/Notification'

class AppointmentsRepository implements INotificationRepositories {

    private ormRepository: MongoRepository<Notification>;

    constructor() {
        this.ormRepository = getMongoRepository(Notification, 'mongo')
    }

    public async create({
        content,
        recipient_id
    }: ICreateNotificationDTO): Promise<Notification> {
        const notification = this.ormRepository.create({
            content,
            recipient_id
        });

        await this.ormRepository.save(notification);

        return notification;
    }
}

export default AppointmentsRepository;
