import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NoteService } from '../../core/note';

const SEARCH_DEBOUNCE_MS = 350;

@Component({
  selector: 'app-note-list',
  imports: [RouterLink, FormsModule],
  templateUrl: './note-list.html',
  styleUrl: './note-list.scss'
})
export class NoteList implements OnInit, OnDestroy {
  protected readonly noteService = inject(NoteService);

  /** Valeur affichee dans le champ, mise a jour a chaque frappe. */
  searchTerm = '';

  private searchDebounceHandle: ReturnType<typeof setTimeout> | undefined;

  ngOnInit(): void {
    this.noteService.loadAll();
  }

  ngOnDestroy(): void {
    clearTimeout(this.searchDebounceHandle);
  }

  /** Declenche depuis (ngModelChange) : attend une pause de frappe avant d'appeler l'API. */
  onSearchChange(term: string): void {
    clearTimeout(this.searchDebounceHandle);
    this.searchDebounceHandle = setTimeout(() => {
      // Toute nouvelle recherche repart de la premiere page.
      this.noteService.loadAll(0, this.noteService.size(), term.trim() || null);
    }, SEARCH_DEBOUNCE_MS);
  }

  clearSearch(): void {
    this.searchTerm = '';
    clearTimeout(this.searchDebounceHandle);
    this.noteService.loadAll(0, this.noteService.size(), null);
  }

  reload(): void {
    this.noteService.loadAll(this.noteService.page(), this.noteService.size(), this.noteService.search());
  }

  previousPage(): void {
    const current = this.noteService.page();
    if (current > 0) {
      this.noteService.loadAll(current - 1, this.noteService.size(), this.noteService.search());
    }
  }

  nextPage(): void {
    const list = this.noteService.notes();
    if (list && !list.last) {
      this.noteService.loadAll(this.noteService.page() + 1, this.noteService.size(), this.noteService.search());
    }
  }

  remove(id: number, title: string): void {
    if (!confirm(`Supprimer la note "${title}" ?`)) {
      return;
    }
    this.noteService.delete(id).subscribe();
  }
}
