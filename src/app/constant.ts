import { environment } from '../environments/environment';

//set the endpoint-- currently i have set it here as a static
export const apiUrl = {
    getItems: `${environment.API_URL}` + '/search?query=foo&tags=story',
}