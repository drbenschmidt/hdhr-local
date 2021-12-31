/* tslint:disable:max-line-length no-empty-interface */
export interface IRegisterUserAddressInput {
    /** s:string(undefined) */
    UUID: string;
    /** s:string(undefined) */
    StreetAddress: string;
    /** s:string(undefined) */
    City: string;
    /** s:string(undefined) */
    State: string;
    /** s:string(undefined) */
    Zip: string;
    /** s:string(undefined) */
    Plus4: string;
}

export interface IRegisterUserAddressOutput {
    RegisterUserAddressResult: DataServiceSoap12Types.IRegisterUserAddressResult;
}

export interface IRegisterUserZipInput {
    /** s:string(undefined) */
    UUID: string;
    /** s:string(undefined) */
    Zip: string;
}

export interface IRegisterUserZipOutput {
    RegisterUserZipResult: DataServiceSoap12Types.IRegisterUserZipResult;
}

export interface IRequestProgramDataInput {
    /** s:string(undefined) */
    UUID: string;
    /** s:string(undefined) */
    ProviderId: string;
    /** s:int(undefined) */
    DaysRequested: number;
}

export interface IRequestProgramDataOutput {
    RequestProgramDataResult: DataServiceSoap12Types.IRequestProgramDataResult;
}

export interface IRequestProgramData2Input {
    /** s:string(undefined) */
    UUID: string;
    /** s:string(undefined) */
    ProviderId: string;
    /** s:int(undefined) */
    DaysRequested: number;
    /** s:string(undefined) */
    UTCStartTime: string;
}

export interface IRequestProgramData2Output {
    RequestProgramData2Result: DataServiceSoap12Types.IRequestProgramData2Result;
}

export interface IRequestLineupDataInput {
    /** s:string(undefined) */
    UUID: string;
    /** s:string(undefined) */
    ProviderId: string;
}

export interface IRequestLineupDataOutput {
    RequestLineupDataResult: DataServiceSoap12Types.IRequestLineupDataResult;
}

export interface IRequestProvidersZipInput {
    /** s:string(undefined) */
    VendorId: string;
    /** s:string(undefined) */
    Zip: string;
}

export interface IRequestProvidersZipOutput {
    RequestProvidersZipResult: DataServiceSoap12Types.IRequestProvidersZipResult;
}

export interface IRequestLineupData2Input {
    /** s:string(undefined) */
    VendorId: string;
    /** s:string(undefined) */
    ProviderId: string;
}

export interface IRequestLineupData2Output {
    RequestLineupData2Result: DataServiceSoap12Types.IRequestLineupData2Result;
}

export interface ITestRegisterUserHouseholdInput {}

export interface ITestRegisterUserHouseholdOutput {
    TestRegisterUserHouseholdResult: DataServiceSoap12Types.ITestRegisterUserHouseholdResult;
}

export interface ITestRegisterUserZipInput {}

export interface ITestRegisterUserZipOutput {
    TestRegisterUserZipResult: DataServiceSoap12Types.ITestRegisterUserZipResult;
}

export interface ITestRequestProgramDataHouseholdLevelInput {
    /** s:string(undefined) */
    provider_type: string;
}

export interface ITestRequestProgramDataHouseholdLevelOutput {
    TestRequestProgramDataHouseholdLevelResult: DataServiceSoap12Types.ITestRequestProgramDataHouseholdLevelResult;
}

export interface ITestRequestLineupDataZipLevelInput {
    /** s:string(undefined) */
    provider_type: string;
}

export interface ITestRequestLineupDataZipLevelOutput {
    TestRequestLineupDataZipLevelResult: DataServiceSoap12Types.ITestRequestLineupDataZipLevelResult;
}

export interface ITestRequestProgramDataZipLevelInput {
    /** s:string(undefined) */
    provider_type: string;
}

export interface ITestRequestProgramDataZipLevelOutput {
    TestRequestProgramDataZipLevelResult: DataServiceSoap12Types.ITestRequestProgramDataZipLevelResult;
}

export interface IDataServiceSoap12Soap {
    RegisterUserAddress: (input: IRegisterUserAddressInput, cb: (err: any | null, result: IRegisterUserAddressOutput, raw: string,  soapHeader: {[k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    RegisterUserZip: (input: IRegisterUserZipInput, cb: (err: any | null, result: IRegisterUserZipOutput, raw: string,  soapHeader: {[k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    RequestProgramData: (input: IRequestProgramDataInput, cb: (err: any | null, result: IRequestProgramDataOutput, raw: string,  soapHeader: {[k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    RequestProgramData2: (input: IRequestProgramData2Input, cb: (err: any | null, result: IRequestProgramData2Output, raw: string,  soapHeader: {[k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    RequestLineupData: (input: IRequestLineupDataInput, cb: (err: any | null, result: IRequestLineupDataOutput, raw: string,  soapHeader: {[k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    RequestProvidersZip: (input: IRequestProvidersZipInput, cb: (err: any | null, result: IRequestProvidersZipOutput, raw: string,  soapHeader: {[k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    RequestLineupData2: (input: IRequestLineupData2Input, cb: (err: any | null, result: IRequestLineupData2Output, raw: string,  soapHeader: {[k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    TestRegisterUserHousehold: (input: ITestRegisterUserHouseholdInput, cb: (err: any | null, result: ITestRegisterUserHouseholdOutput, raw: string,  soapHeader: {[k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    TestRegisterUserZip: (input: ITestRegisterUserZipInput, cb: (err: any | null, result: ITestRegisterUserZipOutput, raw: string,  soapHeader: {[k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    TestRequestProgramDataHouseholdLevel: (input: ITestRequestProgramDataHouseholdLevelInput, cb: (err: any | null, result: ITestRequestProgramDataHouseholdLevelOutput, raw: string,  soapHeader: {[k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    TestRequestLineupDataZipLevel: (input: ITestRequestLineupDataZipLevelInput, cb: (err: any | null, result: ITestRequestLineupDataZipLevelOutput, raw: string,  soapHeader: {[k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    TestRequestProgramDataZipLevel: (input: ITestRequestProgramDataZipLevelInput, cb: (err: any | null, result: ITestRequestProgramDataZipLevelOutput, raw: string,  soapHeader: {[k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
}

export namespace DataServiceSoap12Types {
    export interface IProvider {
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        ProviderId: string;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        ServiceType: string;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        Description: string;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        City: string;
    }
    export interface IRegisterUserAddressResult {
        /** http://www.titantv.com/services/dataservice#s:int(undefined) */
        ErrorCode: number;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        ErrorDescription: string;
        Provider: DataServiceSoap12Types.IProvider[];
    }
    export interface IRegisterUserZipResult {
        /** http://www.titantv.com/services/dataservice#s:int(undefined) */
        ErrorCode: number;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        ErrorDescription: string;
        Provider: DataServiceSoap12Types.IProvider[];
    }
    export interface IStation {
        /** http://www.titantv.com/services/dataservice#s:int(undefined) */
        station_id: number;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        call_sign: string;
        /** http://www.titantv.com/services/dataservice#s:int(undefined) */
        rf_channel: number;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        network: string;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        psip_major: string;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        psip_minor: string;
    }
    export interface IStations {
        Station: DataServiceSoap12Types.IStation[];
    }
    export interface IActors {
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        actor: string;
    }
    export interface IProgram {
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        program_id: string;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        run_time: string;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        title: string;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        episode_title: string;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        episode_id: string;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        is_episodic: string;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        description: string;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        genre: string;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        show_type: string;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        mpaa_rating: string;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        star_rating: string;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        language: string;
        Actors: DataServiceSoap12Types.IActors;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        director: string;
    }
    export interface IPrograms {
        Program: DataServiceSoap12Types.IProgram[];
    }
    export interface ISchedule {
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        program_id: string;
        /** http://www.titantv.com/services/dataservice#s:int(undefined) */
        station_id: number;
        /** http://www.titantv.com/services/dataservice#s:int(undefined) */
        start_time: number;
        /** http://www.titantv.com/services/dataservice#s:int(undefined) */
        end_time: number;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        repeat: string;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        hd: string;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        stereo: string;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        cc: string;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        tv_rating: string;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        fv_rating: string;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        other_rating: string;
    }
    export interface ISchedules {
        Schedule: DataServiceSoap12Types.ISchedule[];
    }
    export interface IProgramData {
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        BaseTime: string;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        ProviderId: string;
        /** http://www.titantv.com/services/dataservice#s:int(undefined) */
        StationCount: number;
        /** http://www.titantv.com/services/dataservice#s:int(undefined) */
        ScheduleCount: number;
        /** http://www.titantv.com/services/dataservice#s:int(undefined) */
        ProgramCount: number;
        Stations: DataServiceSoap12Types.IStations;
        Programs: DataServiceSoap12Types.IPrograms;
        Schedules: DataServiceSoap12Types.ISchedules;
    }
    export interface IRequestProgramDataResult {
        /** http://www.titantv.com/services/dataservice#s:int(undefined) */
        ErrorCode: number;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        ErrorDescription: string;
        ProgramData: DataServiceSoap12Types.IProgramData[];
    }
    export interface IRequestProgramData2Result {
        /** http://www.titantv.com/services/dataservice#s:int(undefined) */
        ErrorCode: number;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        ErrorDescription: string;
        ProgramData: DataServiceSoap12Types.IProgramData[];
    }
    export interface IRequestLineupDataResult {
        /** http://www.titantv.com/services/dataservice#s:int(undefined) */
        ErrorCode: number;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        ErrorDescription: string;
        /** http://www.titantv.com/services/dataservice#s:int(undefined) */
        StationCount: number;
        Stations: DataServiceSoap12Types.IStations;
    }
    export interface IRequestProvidersZipResult {
        /** http://www.titantv.com/services/dataservice#s:int(undefined) */
        ErrorCode: number;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        ErrorDescription: string;
        Provider: DataServiceSoap12Types.IProvider[];
    }
    export interface IRequestLineupData2Result {
        /** http://www.titantv.com/services/dataservice#s:int(undefined) */
        ErrorCode: number;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        ErrorDescription: string;
        /** http://www.titantv.com/services/dataservice#s:int(undefined) */
        StationCount: number;
        Stations: DataServiceSoap12Types.IStations;
    }
    export interface ITestRegisterUserHouseholdResult {
        /** http://www.titantv.com/services/dataservice#s:int(undefined) */
        ErrorCode: number;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        ErrorDescription: string;
        Provider: DataServiceSoap12Types.IProvider[];
    }
    export interface ITestRegisterUserZipResult {
        /** http://www.titantv.com/services/dataservice#s:int(undefined) */
        ErrorCode: number;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        ErrorDescription: string;
        Provider: DataServiceSoap12Types.IProvider[];
    }
    export interface ITestRequestProgramDataHouseholdLevelResult {
        /** http://www.titantv.com/services/dataservice#s:int(undefined) */
        ErrorCode: number;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        ErrorDescription: string;
        ProgramData: DataServiceSoap12Types.IProgramData[];
    }
    export interface ITestRequestLineupDataZipLevelResult {
        /** http://www.titantv.com/services/dataservice#s:int(undefined) */
        ErrorCode: number;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        ErrorDescription: string;
        /** http://www.titantv.com/services/dataservice#s:int(undefined) */
        StationCount: number;
        Stations: DataServiceSoap12Types.IStations;
    }
    export interface ITestRequestProgramDataZipLevelResult {
        /** http://www.titantv.com/services/dataservice#s:int(undefined) */
        ErrorCode: number;
        /** http://www.titantv.com/services/dataservice#s:string(undefined) */
        ErrorDescription: string;
        ProgramData: DataServiceSoap12Types.IProgramData[];
    }
}
