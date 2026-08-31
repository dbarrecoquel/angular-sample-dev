export interface Todo {
    id : number;
    title : string;
    description? : string;
    done : boolean;
    createdAt : number;
}

export type TodoDraft = Pick<Todo, 'title' | 'description'>;