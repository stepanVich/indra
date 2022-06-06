export enum FetchErrorCode {
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  PERSON_DEACTIVATED = 'PERSON_DEACTIVATED',
  PROFILE_REJECTED = 'PROFILE_REJECTED',
  PROFILE_NOT_ACTIVATED = 'PROFILE_NOT_ACTIVATED',
  PROFILE_SUSPENDED = 'PROFILE_SUSPENDED',
  PROFILE_DEACTIVATED = 'PROFILE_DEACTIVATED',
  CERT_NOT_FOUND = 'CERT_NOT_FOUND',
  SIGN_VERIFICATION_FAILURE = 'SIGN_VERIFICATION_FAILURE',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_PROCESSING_ERROR = 'TOKEN_PROCESSING_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  NO_INTERNET_CONN = 'NO_INTERNET_CONN',
  NOT_FOUND = 'NOT_FOUND',
  UNKNOWN = 'UNKNOWN',
}

export class FetchError extends Error {
  name: string;
  code: FetchErrorCode;
  status?: number;
  data?: any;
  constructor(code: FetchErrorCode, status?: number, data?: any) {
    super(code);
    this.code = code;
    this.status = status;
    this.data = data;
    this.name = 'FetchError';
  }
  getName() {
    return this.code;
  }
  getCode() {
    return this.code;
  }
  getStatus() {
    return this.status;
  }
  getData() {
    return this.data;
  }
}

class FetchService {
  async get<T>(url: string, params: object = {}, useAuthToken: boolean = true): Promise<T> {
    console.log(url);
    /*if (useAuthToken) {
      await cryptoService.refreshToken();
    }*/

    const {headers, ...otherParams} = <any>params;

    let h: any = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    };
    /*console.log(h);
    if (useAuthToken) {
      h.Authorization = `Bearer ${cryptoService.getAuthToken()}`;
    }*/
    console.log(h);

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'get',
        headers: h,
        ...otherParams,
      });
    } catch (e) {
      console.log(e.message);
      //loggingService.error(e.message);
      throw new FetchError(FetchErrorCode.NO_INTERNET_CONN);
    }

    //return {test: 'OK'};

    if (response.ok) {
      return response.json();
    } else {
      throw await this.handleErrorResponse(response);
    }
  }

  //async put<T>(url: string, data: object = {}, params: object = {}, useAuthToken: boolean = true): Promise<T> {
    /*console.log(url);
    if (useAuthToken) {
      await cryptoService.refreshToken();
    }

    const {headers, ...otherParams} = <any>params;

    let h: any = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    };

    if (useAuthToken) {
      h.Authorization = `Bearer ${cryptoService.getAuthToken()}`;
    }
    console.log(h);

    let response;
    try {
      response = await fetch(url, {
        method: 'put',
        headers: h,
        body: JSON.stringify(data),
        ...otherParams,
      });
    } catch (e) {
      console.log(e.message);
      loggingService.error(e.message);
      throw new FetchError(FetchErrorCode.NO_INTERNET_CONN);
    }

    if (response.ok) {
      // tslint:disable-next-line: no-unsafe-any
      return response.json();
    } else {
      throw await this.handleErrorResponse(response);
    }*/
  //}

  async post<T>(url: string, data: any, params: object = {}, useAuthToken: boolean = true): Promise<T> {
    console.log(url);
    /*if (useAuthToken) {
      await cryptoService.refreshToken();
    }*/

    console.log(data);

    const {headers = {}, ...otherParams} = <any>params;

    let h: any = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      //'mode': 'cors',
      ...headers,
    };
    /*if (useAuthToken) {
      h.Authorization = `Bearer ${cryptoService.getAuthToken()}`;
    }*/
    console.log(h);


    /*let response = await fetch(url, {
      crossDomain:true,
      method: 'post',
      body: JSON.stringify(data),
      headers: h,
      ...otherParams,
    }).then(res => res.json());*/

    if ( typeof(data) !== 'string')
    {
      data = JSON.stringify(data)
    }

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'post',
        body: data,
        headers: h,
        ...otherParams,
      });

      /*if (response.ok) {
        // tslint:disable-next-line: no-unsafe-any
        return response.json();
     }*/
    } catch (e) {
      //console.log(e.message);
      //loggingService.error(e.message);
      //console.log('--------------response ERROR1: ' + e.message);
      throw new FetchError(FetchErrorCode.NO_INTERNET_CONN);
    }

    if (response.ok) {
        // tslint:disable-next-line: no-unsafe-any
        //console.log('--------------response OK: ' + response.json());
        return response.json();
    } else {
        //console.log('--------------response ERROR2: ');
        throw await this.handleErrorResponse(response);
    }

    //return {test: 'OK'};
  }

  async postString<T>(url: string, data: string, params: object = {}, useAuthToken: boolean = true): Promise<T> {
    console.log(url);
    /*if (useAuthToken) {
      await cryptoService.refreshToken();
    }*/

    console.log(data);

    const {headers = {}, ...otherParams} = <any>params;

    let h: any = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'mode': 'cors',
      ...headers,
    };
    /*if (useAuthToken) {
      h.Authorization = `Bearer ${cryptoService.getAuthToken()}`;
    }*/
    console.log(h);


    /*let response = await fetch(url, {
      crossDomain:true,
      method: 'post',
      body: JSON.stringify(data),
      headers: h,
      ...otherParams,
    }).then(res => res.json());*/


    let response: Response;
    try {
      response = await fetch(url, {
        method: 'post',
        body: data,
        headers: h,
        ...otherParams,
      });

      /*if (response.ok) {
        // tslint:disable-next-line: no-unsafe-any
        return response.json();
     }*/
    } catch (e) {
      //console.log(e.message);
      //loggingService.error(e.message);
      //console.log('--------------response ERROR1: ' + e.message);
      throw new FetchError(FetchErrorCode.NO_INTERNET_CONN);
    }

    if (response.ok) {
        // tslint:disable-next-line: no-unsafe-any
        //console.log('--------------response OK: ' + response.json());
        return response.json();
    } else {
        //console.log('--------------response ERROR2: ');
        throw await this.handleErrorResponse(response);
    }

    //return {test: 'OK'};
  }

  //private async handleErrorResponse<T>(response: Response): Promise<T> {
  private async handleErrorResponse(response: Response): Promise<Error> {
    //console.log('' + response.status + ' ' + response.statusText);
    /*loggingService.error('' + response.status + ' ' + response.statusText);*/
    if (response.status === 400) {
      let resp: any;
      try {
        resp = await response.json();
      } catch (e) {
        throw new FetchError(FetchErrorCode.UNKNOWN, response.status);
      }
      throw new FetchError(FetchErrorCode.BAD_REQUEST, response.status, resp);
    } else if (response.status === 404) {
      throw new FetchError(FetchErrorCode.NOT_FOUND, response.status);
    } else if (response.status === 403) {
      /*let resp: ErrorResponse;
      try {
        resp = await response.json();
      } catch (e) {/*
        throw new FetchError(FetchErrorCode.UNKNOWN, response.status);
      /*}*/
      //throw new FetchError(resp.errorCode, response.status);
      throw new FetchError(FetchErrorCode.UNKNOWN, response.status);
    } else {
      throw new FetchError(FetchErrorCode.UNKNOWN, response.status);
    }
    //return await response.json();
    //throw new FetchError(FetchErrorCode.BAD_REQUEST, response.status);
  }
}

const fetchService = new FetchService();

export default fetchService;
