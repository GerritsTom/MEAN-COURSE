import { Injectable } from '@angular/core';
import { Adapter } from '../adapter';

export class Post {
constructor(
  public id: string,
  public title: string,
  public content: string,
  public imagePath: string
) {}
}

@Injectable({
  providedIn: 'root'
})
export class PostAdapter implements Adapter<Post> {
  adapt(item: any): Post {
    return new Post(
      item.id,
      item.title,
      item.content,
      item.imagePath
    );
  }
}

