import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { TodoService } from "../../core/todo";

@Component({
    selector : 'app-todo-list',
    imports : [RouterLink],
    templateUrl : './todo-list.html',
    styleUrl : './todo-list.scss'
})
export class TodoList {

    protected readonly todoService = inject(TodoService);

    remove(id: number, title : string) : void {
        if (confirm(`Supprimer la tache ${title}`))
            this.todoService.delete(id);
    }
    toggle(id : number) : void {
        this.todoService.toggleDone(id);
    }

}