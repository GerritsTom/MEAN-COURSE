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
  private mode = 'create';
  // @Output() postCreated = new EventEmitter<Post>(); we use dependency injection through sercives

  ngOnInit(): void {
    this.route.paramMap
    .subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {

      }
    })
  }

  constructor(public postsService: PostsService, public route: ActivatedRoute) {}


  /* property binding and string interpolation
  onAddPost(postInput: HTMLTextAreaElement) {
    console.log(postInput);
    this.newPost = postInput.value;
  } */

  /* two way binding */
  onAddPost(form: NgForm) {
    /*
    const post: Post = {
        title: form.value.title,
        content: form.value.content}
        ; */
    // this.postCreated.emit(post);
    this.postsService.addPost(form.value.title, form.value.content);

    // reset the form
    form.resetForm();
  }
}
