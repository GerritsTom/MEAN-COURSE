import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create-component.html',
  styleUrls: ['./post-create-component.css']
})
export class PostCreateComponent implements OnInit {

  enteredContent = '';
  enteredTitle = '';
  post: Post;
  private mode = 'create';
  private postId: string;
  private isLoading = false;

  // @Output() postCreated = new EventEmitter<Post>(); we use dependency injection through sercives

  ngOnInit(): void {
    this.route.paramMap
    .subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        // synchronous this.post = this.postsService.getPost(this.postId);
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.post = {id: postData._id, title: postData.title, content: postData.content};
          this.isLoading = false;
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  constructor(public postsService: PostsService, public route: ActivatedRoute) {}


  /* property binding and string interpolation
  onAddPost(postInput: HTMLTextAreaElement) {
    console.log(postInput);
    this.newPost = postInput.value;
  } */

  /* two way binding */
  onSavePost(form: NgForm) {
    /*
    const post: Post = {
        title: form.value.title,
        content: form.value.content}
        ; */
    // this.postCreated.emit(post);
    if (this.mode == 'create') {
      this.postsService.addPost(form.value.title, form.value.content);
    } else {
      this.postsService.updatePost(this.postId, form.value.title, form.value.content);
    }

    // reset the form
    form.resetForm();
  }
}
