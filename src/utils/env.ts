import "dotenv/config";


//for port
export const env = (name: string, defaultValue?: number) => {
    const value = process.env[name];
    if(value) return value;
    if(defaultValue) return defaultValue;
    throw new Error(`Missing process.env[${name}]`)
}
//the first helper returns string | number value, which is impossible for jwtToken secret and not god for other things
//for jwtToken
export const envString = (name: string) => {
    const value = process.env[name];
    if(value) return value;
    throw new Error(`Missing process.env[${name}]`)
}