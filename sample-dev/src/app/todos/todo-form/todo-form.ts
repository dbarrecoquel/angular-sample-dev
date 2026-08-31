import { Component , computed , inject , signal } from "@angular/core";
import { ReactiveFormsModule , FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute , Router, RouterLink } from "@angular/router";
import { TodoService } from "../../core/todo";


@Component({
    selector : 'app-todo-form',
    imports : [ReactiveFormsModule, RouterLink],
    templateUrl : './todo-form.html',
    styleUrl : './todo-form.scss'
})
export class TodoForm {

    private readonly fb = inject(FormBuilder);
    private readonly todoService = inject(TodoService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    private readonly todoId = signal<number | null> (null);
    
    readonly isEditMode = computed(() => this.todoId() !== null);

    readonly form = this.fb.nonNullable.group({
        title : ['', Validators.required],
        description : ['']
    })

    constructor() {
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            const id = Number(idParam);
            const existing = this.todoService.getById(id);
            if (existing) {
                this.todoId.set(id);
                this.form.patchValue( {
                    title : existing.title,
                    description : existing.description ?? ''
                })
            }
            else
                this.router.navigateByUrl('/todos');
        }
    }

    submit() : void {
        if (this.form.invalid){
            this.form.markAllAsTouched();
            return;
        }
        const value = this.form.getRawValue();
        const id = this.todoId();

        if (id !== null){
            this.todoService.update(id, value);
        }
        else 
            this.todoService.create(value);

        this.router.navigateByUrl('/todos');
    }
}