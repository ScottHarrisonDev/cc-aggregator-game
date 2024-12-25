import type { AlgoliaResponse, MappedResult, Result } from "./types";

export const parseResultsFromResponse = (response: AlgoliaResponse): Array<Result> => {
    return response.results[0].hits;
}

export const limitResults = (results: Array<Result>, limit: number): Array<Result> => {
    return results.slice(0, limit);
}

export const mapResultData = (result: Result): MappedResult => {
    const { title, mainImageUrl } = result;

    return {
        title,
        url: generateImageURL(mainImageUrl),
    }
}

export const generateImageURL = (url: string): string => {
    return `${url}?w=400`;
}