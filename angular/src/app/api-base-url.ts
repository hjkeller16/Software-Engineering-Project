import { InjectionToken } from "@angular/core";
import { environment } from "src/environments/environment";

export const API_BASE_URL = new InjectionToken<string>('api-base-url');

export function apiBaseUrlFactory() {
    return environment.production ? `${location.protocol}//${location.host}` : 'http://localhost:3000';
}
