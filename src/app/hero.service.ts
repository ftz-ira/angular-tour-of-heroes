import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})

export class HeroService {
   private heroesUrl = 'api/heroes';

  constructor(private messageService: MessageService, private http: HttpClient) { }

  getHeroes(): Observable<Hero[]> {
    //this.messageService.add('HeroService fetched heroes');
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }

  getHero(id: number): Observable<Hero> {
    console.log(id);
    this.messageService.add(`HeroService: fetched hero id={id}`);
    return of(HEROES.find( hero => hero.id = id));
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
