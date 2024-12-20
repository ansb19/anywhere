import { Place } from "../../entities/place.entity";


export interface IPlaceService{
    createPlace(placeData: Place): Promise<Place>;
    findPlacebyPlaceID(id: number): Promise<Place | undefined | null>;
    updatePlacebyPlaceID(id: number, placeData: Place): Promise<Place | null>;
    deletePlacebyPlaceID(id: number): Promise<boolean>;
    findAllPlace(): Promise<Place[]>;
}