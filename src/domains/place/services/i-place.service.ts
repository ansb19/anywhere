import { Place } from "../entities/place.entity";



export interface IPlaceService{
    createPlace(placeData: Place): Promise<Place>;
    findPlacebyPlaceID(id: number): Promise<Place >;
    updatePlacebyPlaceID(id: number, placeData: Place): Promise<Place>;
    deletePlacebyPlaceID(id: number): Promise<Place>;
    findAllPlace(): Promise<Place[]>;
}