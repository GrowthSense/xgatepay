import { JsonObject } from "./json-object.interface";
export interface JwtPayLoad extends JsonObject{
    iss?:string;

    sub?:string;

    aud?:string[];

    iat?:string;

    exp?:string;

    azp?:string;

    scope?:string;

}