import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchInGoogleService {
  readonly apiUrl = "http://localhost:3000/search_google";

  constructor(
    private http: HttpClient,
  ) { }

  private getHeaders() {
    return {
        headers: new HttpHeaders({})
    };
  }

  async getGoogleResults(params: {search: string, start:number}): Promise<any>  {
		return firstValueFrom(this.http.get(
          `${this.apiUrl}?search=${params.search}&start=${params.start}`,
          this.getHeaders()
        ))
        .then((res) => {
            return res;
        })
        .catch(err => {
          throw Error(err)
        })
	}
}
