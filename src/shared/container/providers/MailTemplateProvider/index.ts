import { container } from 'tsyringe'

import IMailTemplateProvider from './models/IMailTemplateProvider'

import HandlebarMailTemplateProvider from './implementations/HandlebarMailTemplateProvider'

const providers = {
    handlebars: HandlebarMailTemplateProvider,
}

container.registerSingleton<IMailTemplateProvider>(
    'MailTemplateProvider',
    providers.handlebars,
)
