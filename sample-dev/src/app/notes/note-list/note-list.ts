import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NoteService } from '../../core/note';

@Component({
  selector: 'app-note-list',
  imports: [RouterLink],
  templateUrl: './note-list.html',
  styleUrl: './note-list.scss'
})
export class NoteList implements OnInit {
  protected readonly noteService = inject(NoteService);

  ngOnInit(): void {
    this.noteService.loadAll();
  }

  reload(): void {
    this.noteService.loadAll(this.noteService.page(), this.noteService.size());
  }

  previousPage(): void {
    const current = this.noteService.page();
    if (current > 0) {
      this.noteService.loadAll(current - 1, this.noteService.size());
    }
  }

  nextPage(): void {
    const list = this.noteService.notes();
    if (list && !list.last) {
      this.noteService.loadAll(this.noteService.page() + 1, this.noteService.size());
    }
  }

  remove(id: number, title: string): void {
    if (!confirm(`Supprimer la note "${title}" ?`)) {
      return;
    }
    this.noteService.delete(id).subscribe();
  }
}
