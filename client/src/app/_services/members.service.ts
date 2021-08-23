import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  paginatedResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]>();

  constructor(private http: HttpClient) { }

  getMembers(page?: number, itemsPerPage?: number) {
    // if (this.members.length > 0) 
      // return of(this.members); // Returning the members array as observable

    let params = new HttpParams();
    
    if (page && itemsPerPage) {
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }

    // In order to pass the parameters (query string) to get http request we should add {observe: 'response', params}
    return this.http.get<Member[]>(this.baseUrl + 'users', {observe: 'response', params}).pipe(
      map(response => {
        this.paginatedResult.result = response.body;
        if (response.headers.get('Pagination')) {
          this.paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return this.paginatedResult;
      })
    );
  }

  getMember(username: string) {
    const member = this.members.find(m => m.username === username);

    if (member !== undefined) 
      return of(member)
    return this.http.get<Member>(this.baseUrl + 'users/' + username).pipe(
      map(member => {
        this.members.push(member);
        return member;
      })
    );
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }

  setMainPhoto(photoId) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }
}
