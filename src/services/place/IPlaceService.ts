export interface IPlaceService{
    createPlace(placeData: any): Promise<any>;
    findPlacebyPlaceID(id: number): Promise<any | undefined | null>;
    updatePlacebyPlaceID(id: number, placeData: any): Promise<any | null>;
    deletePlacebyPlaceID(id: number): Promise<boolean>;
    findAllPlace(): Promise<any[]>;
}