import { Post } from './post.model';
import { Injectable } from '@angular/core';
import {Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  // Subject is a kind of eventemitter
  private postsUpdated = new Subject<Post[]>();

  getPosts() {
    return [...this.posts];
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {title: title, content: content};
    this.posts.push(post);
    // emit the update postsarray
    this.postsUpdated.next([...this.posts]);
  }
}
