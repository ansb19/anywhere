import { Place } from "../../entities/Place";

export interface IPlaceSearchService{
    findPlacebyScroll(page: number): Promise<Place[]>;
    findPlacebyTag(tag: string): Promise<Place[]>;
    findPlacebyKeyword(keword: string): Promise<Place[]>;
    findPlacebyCategory(category_id: number): Promise<Place[]>;
}