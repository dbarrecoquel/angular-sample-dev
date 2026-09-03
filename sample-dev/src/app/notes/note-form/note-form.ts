import { Component, computed, inject, signal, DestroyRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NoteService } from '../../core/note';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-note-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './note-form.html',
  styleUrl: './note-form.scss'
})
export class NoteForm {
  private readonly fb = inject(FormBuilder);
  private readonly noteService = inject(NoteService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly noteId = signal<number | null>(null);

  readonly isEditMode = computed(() => this.noteId() !== null);
  readonly loading = signal(false);
  readonly submitting = signal(false);
  readonly loadError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    content: ['']
  });

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.noteId.set(id);
      this.loading.set(true);

      this.noteService.getById(id).pipe(takeUntilDestroyed()).subscribe({
        next: note => {
          this.form.patchValue({ title: note.title, content: note.content });
          this.loading.set(false);
        },
        error: err => {
          this.loadError.set(err.message ?? 'Impossible de charger la note.');
          this.loading.set(false);
        }
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const id = this.noteId();
    this.submitting.set(true);

    const request$ = id !== null ? this.noteService.update(id, value) : this.noteService.create(value);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.router.navigateByUrl('/notes'),
      error: (err) => {

        this.loadError.set(err.message ?? 'Erreur');
        this.submitting.set(false)
      }
    });
  }
}
