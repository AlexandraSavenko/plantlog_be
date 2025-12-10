import { plantType } from "../types/plants";
import { ParsedQs } from "qs";

const parseValue = (value: unknown) => {
  return Array.isArray(value) ? String(value[0]) : String(value);
};
const sortOrderList = ["asc", "desc"];
// could also be 1 which matches "asc" and -1 which matches "desc"

//not only I type sortByList here, I also add the same type in schema file, where I keep the list, otherwise error occurs on passing arguments.
export const parseSortParams = (
  { sortBy, sortOrder }: ParsedQs,
  sortByList: (keyof plantType)[]
) => {
  const sortOrderStr = parseValue(sortOrder);
  const sortByStr = parseValue(sortBy);

  const parsedSortOrder = sortOrderList.includes(sortOrderStr)
    ? sortOrderStr
    : sortOrderList[0];
  const parsedSortBy = sortByList.includes(sortByStr as keyof plantType)
    ? sortByStr
    : "_id";
  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};

// Type ParsedQs, described in Types suggests that
// any query parameter can potentially be:
// a single string: ?sortBy=name
// an array of strings: ?sortBy=name&sortBy=photo
// nested objects
// arrays of objects -- like this: ?sortBy=name&sortBy=photo  
// (though nested objects/arrays are rare in normal APIs)