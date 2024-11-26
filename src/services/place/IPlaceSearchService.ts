export interface IPlaceSearchService{
    findPlacebyScroll(page: number): Promise<any[]>;
    findPlacebyTag(tag: string): Promise<any[]>;
    findPlacebyKeyword(keword: string): Promise<any[]>;
    findPlacebyCategory(category_id: number): Promise<any[]>;
}