import { describe, it, expect } from "vitest";
import { parseResultsFromResponse, limitResults, mapResultData, generateImageURL, randomiseResults, pad, formatDateTime } from "../utilities";
import type { AlgoliaResponse, Result } from "../types";

describe("Utility Functions", () => {
    describe("parseResultsFromResponse", () => {
        it("should return the hits array from the AlgoliaResponse", () => {
            const mockResponse: AlgoliaResponse = {
                results: [
                    {
                        hits: [
                            {
                                auctionId: 1,
                                stage: "live",
                                listingStage: "live",
                                countryCode: "GB",
                                regionCode: "UK",
                                currencyCode: "GBP",
                                currentBid: 1000,
                                dtSoldUTC: null,
                                tsSoldUTC: null,
                                dtAuctionEndedUTC: null,
                                tsAuctionEndedUTC: null,
                                dtStageEndsUTC: "2024-12-29T19:00:00Z",
                                location: "London",
                                lotType: "car",
                                mainImagePath: "/image.jpg",
                                mainImageUrl: "https://example.com/image.jpg",
                                vehicleMake: "Ferrari",
                                productMake: "Ferrari",
                                noBids: 5,
                                noReserve: false,
                                reserveMet: false,
                                id: "1",
                                priceBuyNow: 0,
                                priceSold: 0,
                                rank: 1,
                                tsPublishedUTC: 1234567890,
                                reserveLowered: false,
                                saleFormat: "auction",
                                saleType: null,
                                slug: "ferrari-test",
                                title: "Ferrari Test",
                                collectionId: null,
                                vendorType: "managed",
                                isBoosted: "1",
                                productYear: 2020,
                                driveSide: "right",
                                features: {
                                    driveSide: "RHD",
                                    fuelType: "Petrol",
                                    mileage: "10,000 Miles",
                                    modelYear: "2020",
                                    transmission: "Automatic",
                                },
                                tags: ["supercars", "highlights"],
                                objectID: "1",
                                _highlightResult: {
                                    auctionId: { value: "1", matchLevel: "none", matchedWords: [] },
                                    vehicleMake: { value: "Ferrari", matchLevel: "none", matchedWords: [] },
                                    productMake: { value: "Ferrari", matchLevel: "none", matchedWords: [] },
                                    title: { value: "Ferrari Test", matchLevel: "none", matchedWords: [] },
                                    vendorType: { value: "managed", matchLevel: "none", matchedWords: [] },
                                    driveSide: { value: "RHD", matchLevel: "none", matchedWords: [] },
                                    tags: [],
                                },
                            },
                        ],
                    },
                ],
            };

            const results = parseResultsFromResponse(mockResponse);
            expect(results).toEqual(mockResponse.results[0].hits);
        });
    });

    describe("limitResults", () => {
        it("should limit the results to the specified number", () => {
            const mockResults: Array<Result> = [
                { auctionId: 1, title: "Result 1", mainImageUrl: "url1.jpg", ...mockExtraData() },
                { auctionId: 2, title: "Result 2", mainImageUrl: "url2.jpg", ...mockExtraData() },
                { auctionId: 3, title: "Result 3", mainImageUrl: "url3.jpg", ...mockExtraData() },
            ];

            const limitedResults = limitResults(mockResults, 2);
            expect(limitedResults).toEqual([
                { auctionId: 1, title: "Result 1", mainImageUrl: "url1.jpg", ...mockExtraData() },
                { auctionId: 2, title: "Result 2", mainImageUrl: "url2.jpg", ...mockExtraData() },
            ]);
        });

        it("should return all results if the limit exceeds the array length", () => {
            const mockResults: Array<Result> = [{ auctionId: 1, title: "Result 1", mainImageUrl: "url1.jpg", ...mockExtraData() }];

            const limitedResults = limitResults(mockResults, 5);
            expect(limitedResults).toEqual(mockResults);
        });
    });

    describe("mapResultData", () => {
        it("should map a Result to a MappedResult with a resized image URL", () => {
            const mockResult: Result = { auctionId: 1, title: "Test Result", mainImageUrl: "test-url.jpg", ...mockExtraData() };

            const mappedResult = mapResultData(mockResult);
            expect(mappedResult).toEqual({
                title: "Test Result",
                url: "test-url.jpg?w=400",
            });
        });
    });

    describe("generateImageURL", () => {
        it("should append the query parameter for resizing to the URL", () => {
            const url = "https://example.com/image.jpg";

            const generatedURL = generateImageURL(url);
            expect(generatedURL).toBe("https://example.com/image.jpg?w=400");
        });
    });

    describe('randomiseResults', () => {
        it('should return an array of the same length', () => {
            const input: Array<Result> = [
                { auctionId: 1, title: "Result 1", mainImageUrl: "url1.jpg", ...mockExtraData() },
                { auctionId: 2, title: "Result 2", mainImageUrl: "url2.jpg", ...mockExtraData() },
                { auctionId: 3, title: "Result 3", mainImageUrl: "url3.jpg", ...mockExtraData() },
            ];
            const result = randomiseResults(input);
            expect(result).toHaveLength(input.length);
        });

        it('should return the same elements in a different order', () => {
            const input: Array<Result> = [
                { auctionId: 1, title: "Result 1", mainImageUrl: "url1.jpg", ...mockExtraData() },
                { auctionId: 2, title: "Result 2", mainImageUrl: "url2.jpg", ...mockExtraData() },
                { auctionId: 3, title: "Result 3", mainImageUrl: "url3.jpg", ...mockExtraData() },
            ];
            const result = randomiseResults(input);

            expect(result).toEqual(expect.arrayContaining(input));

            const isOrderChanged = JSON.stringify(result) !== JSON.stringify(input);
            expect(isOrderChanged).toBe(true);
        });

        it('should not modify the original array', () => {
            const input: Array<Result> = [
                { auctionId: 1, title: "Result 1", mainImageUrl: "url1.jpg", ...mockExtraData() },
                { auctionId: 2, title: "Result 2", mainImageUrl: "url2.jpg", ...mockExtraData() },
                { auctionId: 3, title: "Result 3", mainImageUrl: "url3.jpg", ...mockExtraData() },
            ];
            const inputCopy = [...input];
            randomiseResults(input);
            expect(input).toEqual(inputCopy);
        });
    });

    describe('pad function', () => {
        it('should return "01" when given 1', () => {
            expect(pad(1)).toBe('01');
        });

        it('should return "09" when given 9', () => {
            expect(pad(9)).toBe('09');
        });

        it('should return "10" when given 10', () => {
            expect(pad(10)).toBe('10');
        });

        it('should return "99" when given 99', () => {
            expect(pad(99)).toBe('99');
        });

        it('should handle zero properly', () => {
            expect(pad(0)).toBe('00');
        });

        it('should work for larger numbers', () => {
            expect(pad(100)).toBe('100');
        });
    });

    describe('formatDateTime function', () => {
        it('should format date correctly with single digit day and month', () => {
            const inputDate = new Date('2024-01-09T09:30:00Z'); // January 9, 2024 at 09:30
            expect(formatDateTime(inputDate)).toBe('9/1/2024 09:30');
        });

        it('should format date correctly with double digit day and month', () => {
            const inputDate = new Date('2024-12-25T15:45:00Z'); // December 25, 2024 at 15:45
            expect(formatDateTime(inputDate)).toBe('25/12/2024 15:45');
        });

        it('should format date correctly when time has single digit hour and minute', () => {
            const inputDate = new Date('2024-12-01T03:09:00Z'); // December 1, 2024 at 03:09
            expect(formatDateTime(inputDate)).toBe('1/12/2024 03:09');
        });

        it('should correctly format large years', () => {
            const inputDate = new Date('9999-12-31T23:59:59Z'); // December 31, 9999 at 23:59
            expect(formatDateTime(inputDate)).toBe('31/12/9999 23:59');
        });

        it('should handle edge cases like February 29 in leap year', () => {
            const inputDate = new Date('2024-02-29T12:30:00Z'); // February 29, 2024 at 12:30 (leap year)
            expect(formatDateTime(inputDate)).toBe('29/2/2024 12:30');
        });
    });
});

const mockExtraData = (): Omit<Result, "auctionId" | "title" | "mainImageUrl"> => ({
    stage: "live",
    listingStage: "live",
    countryCode: "GB",
    regionCode: "UK",
    currencyCode: "GBP",
    currentBid: 1000,
    dtSoldUTC: null,
    tsSoldUTC: null,
    dtAuctionEndedUTC: null,
    tsAuctionEndedUTC: null,
    dtStageEndsUTC: "2024-12-29T19:00:00Z",
    location: "London",
    lotType: "car",
    mainImagePath: "/image.jpg",
    vehicleMake: "Ferrari",
    productMake: "Ferrari",
    noBids: 5,
    noReserve: false,
    reserveMet: false,
    id: "1",
    priceBuyNow: 0,
    priceSold: 0,
    rank: 1,
    tsPublishedUTC: 1234567890,
    reserveLowered: false,
    saleFormat: "auction",
    saleType: null,
    slug: "ferrari-test",
    collectionId: null,
    vendorType: "managed",
    isBoosted: "1",
    productYear: 2020,
    driveSide: "right",
    features: {
        driveSide: "RHD",
        fuelType: "Petrol",
        mileage: "10,000 Miles",
        modelYear: "2020",
        transmission: "Automatic",
    },
    tags: ["supercars", "highlights"],
    objectID: "1",
    _highlightResult: {
        auctionId: { value: "1", matchLevel: "none", matchedWords: [] },
        vehicleMake: { value: "Ferrari", matchLevel: "none", matchedWords: [] },
        productMake: { value: "Ferrari", matchLevel: "none", matchedWords: [] },
        title: { value: "Ferrari Test", matchLevel: "none", matchedWords: [] },
        vendorType: { value: "managed", matchLevel: "none", matchedWords: [] },
        driveSide: { value: "RHD", matchLevel: "none", matchedWords: [] },
        tags: [],
    },
});