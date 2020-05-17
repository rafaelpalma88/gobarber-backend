import { Router } from 'express'
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'
import AppointmentsController from '../controllers/AppointmentsController'
import ProviderAppointmentController from '../controllers/ProviderAppointmentController'

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();
const providerAppointmentController = new ProviderAppointmentController();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post('/', appointmentsController.create)
appointmentsRouter.get('/me', providerAppointmentController.index)

export default appointmentsRouter;
