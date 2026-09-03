export interface Note{
    id : number;
    title : string;
    content : string;
    createdAt : string;
    updatedAt : string;
}

export type NoteDraft = Pick<Note, 'title' | 'content'>;