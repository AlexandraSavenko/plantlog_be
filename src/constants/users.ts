export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const accessTokenLifeTime = 1000 * 60 * 15;
// 1 min has 1000 miliseconds
export const refreshTokenLifeTime = 1000 * 60 * 60 * 24 * 7;

export const authProviderList = ["local", "google"]