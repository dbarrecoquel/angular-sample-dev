export interface Note{
    id : number;
    title : string;
    content : string;
    createdAt : string;
    updatedAt : string;
}

export interface NoteList {

    size : number;
    last : boolean;
    totalPages : number;
    content : Note[];
    totalElements : number;
}

export type NoteDraft = Pick<Note, 'title' | 'content'>;