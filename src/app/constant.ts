import { environment } from '../environments/environment';

//set the endpoint-- currently i have set it here as a static because i have only one
//we can keep our endpoints url, contsant things here.
export const apiUrl = {
    getItems: `${environment.API_URL}` + '/search?query=foo&tags=story',
}