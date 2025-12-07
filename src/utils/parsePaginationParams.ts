import {ParsedQs} from "qs"

const parseNumber = (value: unknown, defaultValue: number) => {
  const parsed = parseInt(String(value), 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
};

//String(value) converts null -> "null" and undefined -> "undefined"

export const parsePaginationParams = ({page, perPage}: ParsedQs) => {
return {
    page: parseNumber(page, 1),
    perPage: parseNumber(perPage, 10)
}
};
