import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, finalize, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Note, NoteDraft, NoteList } from '../models/note.model';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/notes`;

  private readonly _notes = signal<NoteList | null>(null);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  private readonly _page = signal(0);
  private readonly _size = signal(10);

  readonly notes = this._notes.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly page = this._page.asReadonly();
  readonly size = this._size.asReadonly();

  /** Charge une page de notes depuis l'API et met a jour le signal `notes`. */
  loadAll(page = 0, size = this._size()): void {
    this._page.set(page);
    this._size.set(size);
    this._loading.set(true);
    this._error.set(null);

    const params = new HttpParams().set('page', page).set('size', size);

    this.http
      .get<NoteList>(this.baseUrl, { params })
      .pipe(
        tap(notes => this._notes.set(notes)),
        catchError(err => this.handleError(err, 'Impossible de charger les notes.')),
        finalize(() => this._loading.set(false))
      )
      .subscribe();
  }

  /** Recupere une note par id (utilise par le formulaire d'edition). */
  getById(id: number): Observable<Note> {
    return this.http
      .get<Note>(`${this.baseUrl}/${id}`)
      .pipe(catchError(err => this.handleError(err, 'Note introuvable.')));
  }

  create(draft: NoteDraft): Observable<Note> {
    return this.http.post<Note>(this.baseUrl, draft).pipe(
      // La creation modifie le nombre total d'elements / de pages : on recharge la page courante.
      tap(() => this.loadAll(this._page(), this._size())),
      catchError(err => this.handleError(err, 'Impossible de creer la note.'))
    );
  }

  update(id: number, draft: NoteDraft): Observable<Note> {
    return this.http.put<Note>(`${this.baseUrl}/${id}`, draft).pipe(
      tap(updated =>
        this._notes.update(list =>
          list ? { ...list, content: list.content.map(n => (n.id === id ? updated : n)) } : list
        )
      ),
      catchError(err => this.handleError(err, 'Impossible de modifier la note.'))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      // La suppression modifie le nombre total d'elements / de pages : on recharge la page courante.
      tap(() => this.loadAll(this._page(), this._size())),
      catchError(err => this.handleError(err, 'Impossible de supprimer la note.'))
    );
  }

  private handleError(err: HttpErrorResponse, fallbackMessage: string): Observable<never> {
    const message =
      err.status === 0
        ? "Le serveur d'API (Spring Boot) est injoignable. Verifiez qu'il est demarre."
        : fallbackMessage;
    this._error.set(message);
    return throwError(() => new Error(message));
  }
}