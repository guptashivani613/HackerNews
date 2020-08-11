import { environment } from '../environments/environment';

export const apiUrl = {
    getItems: `${environment.API_URL}` + '/search?query=foo&tags=story',
}