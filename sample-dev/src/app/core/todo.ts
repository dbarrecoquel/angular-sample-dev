import { Injectable, computed,inject, signal, PLATFORM_ID  } from "@angular/core";
import { Todo, TodoDraft } from '../models/todo.model';
import { isPlatformBrowser } from '@angular/common';
const STORAGE_KEY = 'dashboard-app.todos';

@Injectable({
    providedIn : 'root'
})
export class TodoService {

    private readonly _todos = signal<Todo[]>([]);
    
    readonly todos = this._todos.asReadonly();

    readonly total = computed(()=> this._todos().length);
    readonly doneCount = computed(()=> this._todos().filter(t => t.done).length);
    readonly pendingCount = computed(() => this.total() - this.doneCount());
    private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

    constructor(){
        if (this.isBrowser){
            const savedTodos = this.loadFromStorage();
            if (savedTodos) {
                this._todos.set(savedTodos);
            }
        }
    }
    getById(id : number) : Todo | undefined {
        return this._todos().find(t => t.id === id);
    }

    create(draft : TodoDraft) : Todo {
        const todo = {
            id : this.nextId(),
            title : draft.title,
            description : draft.description,
            done : false,
            createdAt : Date.now()
        }
        this._todos.update(list => [todo, ...list]);
        this.persist();
        return todo;
    }

    update(id : number, changes : Partial<TodoDraft>) : void {

        this._todos.update(list => 
            list.map(t => 
                t.id === id 
                ? {
                    ...t,
                    title : changes.title !== undefined ? changes.title.trim() : t.title,
                    description : changes.description !== undefined ? changes.description.trim() : t.description
                }
                : t
            ) 
        )
        this.persist();

    }
    toggleDone(id : number) : void {
        this._todos.update(list => 
            list.map(t => t.id === id ? {...t, done : !t.done} : t)
        );
        this.persist();
    }

    delete(id : number) : void {
        this._todos.update(list => 
            list.filter(t => t.id !== id)
        )
        this.persist();
    }
    private nextId() : number {
        const ids = this._todos().map(t => t.id);
        return ids.length ? Math.max(...ids) + 1 : 1;
    }

    private persist() : void {

        try {
            if (this.isBrowser)
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this._todos()));
        }
        catch {
            console.log("erreur sauvegarde");
        }
    }

    private loadFromStorage() : Todo[] {
       
        try {
          

            
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw)
                return this.seed();
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : this.seed();
    
        }
        catch{
            return this.seed();
        }
    }
    private seed(): Todo[] {
        return [
        {
            id: 1,
            title: 'Decouvrir Angular 21',
            description: 'Explorer les signals, le nouveau control flow et les composants standalone.',
            done: true,
            createdAt: Date.now() - 86_400_000
        },
        {
            id: 2,
            title: 'Creer le dashboard',
            description: 'Afficher les sous-projets sous forme de cards.',
            done: false,
            createdAt: Date.now() - 3_600_000
        }
        ];
  }
}