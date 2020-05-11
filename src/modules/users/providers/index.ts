import { container } from 'tsyringe';

import IHashProvider from './HashProvider/models/IHashProvider'
import BCryptHashProvider from './HashProvider/implementations/BCryptHashProvider'

//import IMailProvider from '.'

container.registerSingleton<IHashProvider>(
    'HashProvider',
    BCryptHashProvider
)
