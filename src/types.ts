export interface AlgoliaResponse {
    results: Array<{
        hits: Array<Result>;
        [key: string]: any;
    }>;
}

export type HighlightResultItem = {
    value: string;
    matchLevel: string;
    matchedWords: string[];
}

export interface Result {
    auctionId: number;
    stage: string;
    listingStage: string;
    countryCode: string;
    regionCode: string;
    currencyCode: string;
    currentBid: number;
    dtSoldUTC: string | null;
    tsSoldUTC: number | null;
    dtAuctionEndedUTC: string | null;
    tsAuctionEndedUTC: number | null;
    dtStageEndsUTC: string;
    location: string;
    lotType: string;
    mainImagePath: string;
    mainImageUrl: string;
    vehicleMake: string;
    productMake: string;
    noBids: number;
    noReserve: boolean;
    reserveMet: boolean;
    id: string;
    priceBuyNow: number;
    priceSold: number;
    rank: number;
    tsPublishedUTC: number;
    reserveLowered: boolean;
    saleFormat: string;
    saleType: string | null;
    slug: string;
    title: string;
    collectionId: number | null;
    vendorType: string;
    isBoosted: string;
    productYear: number;
    driveSide: string;
    features: {
        driveSide: string;
        fuelType: string;
        mileage: string;
        modelYear: string;
        transmission: string;
    };
    tags: string[];
    objectID: string;
    _highlightResult: {
        auctionId: HighlightResultItem;
        vehicleMake: HighlightResultItem;
        productMake: HighlightResultItem;
        title: HighlightResultItem;
        vendorType: HighlightResultItem;
        driveSide: HighlightResultItem;
        tags: Array<HighlightResultItem | Record<string, any>>;
    };
}

export type MappedResult = {
	title: string,
	url: string,
}