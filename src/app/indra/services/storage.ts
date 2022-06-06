import AsyncStorage from '@react-native-community/async-storage';
//import logging from './logging';

const LANGUAGE = 'LANGUAGE';

class StorageService {
  private async loadKey(key: string): Promise<any> {
    try {
      const item = await AsyncStorage.getItem(key);
      if (!item) {
        return null;
      }
      return JSON.parse(item);
    } catch (error) {
      //logging.error(error);
      throw new Error('Load key exception ' + error.toString());
    }
  }

  private async storeKey(key: string, value: any) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return await this.loadKey(key);
    } catch (error) {
      //logging.error(error);
      throw new Error('Store key exception ' + error.toString());
    }
  }

  public async getLanguage(): Promise<string> {
    return await this.loadKey(LANGUAGE);
  }

  public async setLanguage(value: string): Promise<void> {
    return await this.storeKey(LANGUAGE, value);
  }
}

const storageService = new StorageService();

export default storageService;
