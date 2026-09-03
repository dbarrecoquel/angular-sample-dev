import { HttpClient , HttpErrorResponse } from "@angular/common/http";
import { Injectable, inject, signal} from '@angular/core';
import { Observable, catchError, finalize, tap, throwError } from "rxjs";
import { environment } from "../../environments/environment";
import { Note, NoteDraft} from '../models/note.model';

@Injectable( {

    providedIn :'root'
})
export class NoteService{

    private readonly http = inject(HttpClient);
    private readonly baseURL = `${environment.apiUrl}/notes`;

    private readonly _notes = signal<Note[]>([]);
    private readonly _loading = signal(false);
    private readonly _error = signal<string | null>(null);

    readonly notes = this._notes.asReadonly();
    readonly loading = this._loading.asReadonly();
    readonly error = this._error.asReadonly();

    loadAll() : void {
        this._loading.set(true);
        this._error.set(null);

        this.http.get<Note[]>(this.baseURL)
        .pipe(
            tap(notes => this._notes.set(notes)),
            catchError(err => this.handleError(err, 'Impossible de charger les notes.')),
            finalize(() => this._loading.set(false))
        )
        .subscribe();
    }

    getById(id : number) : Observable<Note> {
        return this.http.get<Note>(`${this.baseURL}/${id}`)
            .pipe(catchError((err) => this.handleError(err,' Note introuvable.')));
    }

    create(draft : NoteDraft) : Observable<Note> {
        return this.http.post<Note>(this.baseURL, draft).pipe(
            tap(note => this._notes.update((list) => [note, ...list])),
            catchError(err => this.handleError(err, 'Impossible de créer la note.'))
        );
    }

    update(id : number, draft : NoteDraft) : Observable<Note> {
        return this.http.put<Note>(`${this.baseURL}/${id}`, draft).pipe(
            tap(updated => this._notes.update(list => list.map(n => (n.id === id ? updated : n)))
            ),
            catchError(err => this.handleError(err, 'Imposible de modifier la note.'))
        );
    }

    delete(id : number) : Observable<void> {
        return this.http.delete<void>(`${this.baseURL}/${id}`).pipe(
            tap(() => this._notes.update(list => list.filter(n => n.id !== id))),
            catchError(err => this.handleError(err, 'Impossible de supprimer la note.'))
        );
    }

    private handleError(err : HttpErrorResponse, fallBackMessage : string) : Observable<never> {
        const message =
            err.status === 0 ? "Le serveur d'API est injoignable, vérifier qu'il est démarré"
            : fallBackMessage;
        this._error.set(message);
        return throwError(() => new Error(message));
    }

}