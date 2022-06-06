import i18n from 'i18next';
import indraMessages from 'app/indra/messages';
import 'moment/locale/cs';
import 'moment/locale/en-gb';
import {initReactI18next} from 'react-i18next';

const resources = {
  en: {
    indra: {
      ...indraMessages.en
    }
  },
  cs: {
    indra: {
      ...indraMessages.cs
    }
  }
};

// tslint:disable-next-line: no-floating-promises
i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'cs',
  lng: 'cs',
  defaultNS: 'global',
  keySeparator: false,

  interpolation: {
    escapeValue: false
  }
});
export default i18n;
