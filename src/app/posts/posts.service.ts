import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { PostAdapter } from './post.adapter';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private baseUrl = 'http://localhost:3000/api';
  private posts: Post[] = [];
  // Subject is a kind of eventemitter
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router, private adapter: PostAdapter) {}

  getPosts() {

    const url = `${this.baseUrl}/`;
    console.log('in getposts');
    // return [...this.posts];

    /*
    this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts')
      .subscribe((postData) => {
          this.posts = postData.posts;
          this.postsUpdated.next([...this.posts]);
      }); */

    // convert _id from backend to id
    this.http
      .get<{ message: string; posts: any }>(url + 'posts')
      .pipe(
        map(response => {
          return response.posts.map(item => {
            return this.adapter.adapt(item);
            /*{

              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath
            };*/
          });
        })
      )
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(postId: string) {
    // return {...this.posts.find(p => p.id === postId)};
    return this.http.get<{_id: string, title: string, content: string, imagePath: string}>('http://localhost:3000/api/posts/' + postId);
  }

  addPost(title: string, content: string, image: File) {
    // const post: Post = { id: null, title: title, content: content };
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    // JSON can't handle files => FormData
    this.http
      .post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
      .subscribe(responseData => {
        const post: Post = {
          id: responseData.post.id,
          title: title,
          content: content,
          imagePath: responseData.post.imagePath
        };

        //post.id = responseData.postId;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        // navigate away
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  updatePost(postId: string, title: string, content: string, image: File | string) {
    let postData;
    // formdata oder JSON
    // const post: Post = {id: postId, title: title, content: content, imagePath: null};
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', postId);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: postId,
        title: title,
        content: content,
        imagePath: image
      };
    }

    this.http.put('http://localhost:3000/api/posts/' + postId, postData)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === postId);
        const post: Post = {
          id: postId,
          title: title,
          content: content,
          imagePath: ''
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        // navigate
        this.router.navigate(['/']);
      });
  }
}
