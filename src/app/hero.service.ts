import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { MessageService } from './message.service';
import { ApiUrls } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class HeroService {

  private heroesUrl = 'api/heroes';
  //private heroesUrl = ApiUrls.getHeroesUrl;
  
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private messageService: MessageService, private http: HttpClient) { }

  public getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap(() => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id = ${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }
  /** api methode */
  // public getHero(id: number): Observable<Hero> {
  //   // return of(HEROES.find( hero => hero.id = id));
  //   this.messageService.add(`HeroService getHero: fetched hero id=${id}`);
  //   return this.getHeroes().pipe(
  //     map( hero => hero.find(hero => hero.id === id)),
  //     catchError(this.handleError<Hero>('getHeroes'))
  //      );
  // }

  updateHero(hero: Hero): Observable<any> {
    
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    )
  }

  addHero(hero: Hero){
   
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap( (newHero:Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    )
  }
  
  delete(hero: Hero | number): Observable<Hero> {
    
    const id = typeof hero === 'number' ? hero : hero.id;
    const url =`${this.heroesUrl}/${id}`;
   
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log( `deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('delete')),
    );
  }

  public searchHeroes(term: string): Observable<Hero[]> {
    if(!term.trim()){
      return of([])
    }

    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes mathing "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  private handleError<T>(operartion = 'getHeroes', result?: T) {
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
