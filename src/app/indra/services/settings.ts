import i18n from 'app/i18n';
import moment from 'moment';
import storageService from './storage';
import {numeralSetLanguage} from 'app/indra/utils/number';
import {CZ, EN} from 'app/indra/utils/const';
import {getUserLocale} from 'get-user-locale';

class SettingsService {
  async init() {
    //initialize language
    const storedLanguage = await storageService.getLanguage();
    if (storedLanguage) {
      await settingsService.setLanguage(storedLanguage);
      moment.locale(storedLanguage);
      //numeralSetLanguage(storedLanguage);
    } else {
      const userLocale = getUserLocale();
      let language = CZ;
      if (userLocale) {
        language = userLocale.split('-')[0];
        if (language !== CZ) {
          language = EN;
        }
      }
      await storageService.setLanguage(language);
      await settingsService.setLanguage(language);
      moment.locale(language);
      //numeralSetLanguage(language);
    }
  }

  t(message: string, values?: object): string {
    return i18n.t(message, values);
  }

  async setLanguage(language: string) {
    await storageService.setLanguage(language);
    moment.locale(language);
    //numeralSetLanguage(language);
    await i18n.changeLanguage(language);
  }

  getLanguage(): string {
    return i18n.language;
  }
}

const settingsService = new SettingsService();

export default settingsService;
