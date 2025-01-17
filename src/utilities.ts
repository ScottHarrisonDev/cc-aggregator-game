import type { AlgoliaResponse, MappedResult, Result } from "./types";

export const parseResultsFromResponse = (response: AlgoliaResponse): Array<Result> => {
    return response.results[0].hits;
}

export const limitResults = (results: Array<Result>, limit: number): Array<Result> => {
    return results.slice(0, limit);
}

export const filterResults = (results: Array<Result>, filterWords: Array<string>): Array<Result> => {
    return results.filter(({ title }) => {
        return !filterWords.some((word) => title.toLowerCase().includes(word.toLowerCase()));
    });
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

export const randomiseResults = (results: Array<Result>): Array<Result> => {
    return results.toSorted(() => Math.random() - 0.5);
}

export const pad = (value: number): string => {
    return value.toString().padStart(2, '0');
}

export const formatDateTime = (inputDate: Date): string => {
    const yyyy = inputDate.getFullYear();
    const mm = inputDate.getMonth() + 1;
    const dd = inputDate.getDate();
    const hh = pad(inputDate.getHours());
    const ii = pad(inputDate.getMinutes());

    return `${dd}/${mm}/${yyyy} ${hh}:${ii}`;
}