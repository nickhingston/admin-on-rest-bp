import enMessages from 'ra-language-english';
import msEnMessages from './messages'
import polyglotI18nProvider from 'ra-i18n-polyglot';

export const messages = { 
	en: {...msEnMessages, ...enMessages } 
};

const i18nProvider = polyglotI18nProvider(locale => 
	messages[locale],
    'en'
);

export default i18nProvider;