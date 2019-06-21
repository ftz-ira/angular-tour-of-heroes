import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, filter, share } from 'rxjs/operators';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';
import { ApiUrls } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class HeroService {
   //private heroesUrl = 'api/heroes';
   private heroesUrl = ApiUrls.getUsersUrl;
   
   

  constructor(private messageService: MessageService, private http: HttpClient) { }

  public getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(ApiUrls.getUsersUrl).pipe(
      tap(_ => this.log('fetched heroes')),
      share(),
      catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }
  

   public getHero(id: number){
    // return of(HEROES.find( hero => hero.id = id));
    //return this.http.get<Hero>(this.heroesUrl);
    this.getHeroes().subscribe( 
      // res => res.filter(hero => hero.id === id),
      res => console.log(res.find(res =>res.id == id)),
      error => {
        return console.log(error);
      },
      ()=> console.log('fini'));
    this.messageService.add(`HeroService getHero: fetched hero id=${id}`);
  }

  private handleError<T>(operartion = 'operation', result?: T){
    return (error: any): Observable<T> => {

      console.error(error);
      this.log('${operation} failed: ${error.message}');
      return of(result as T);
    }
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
  
}
