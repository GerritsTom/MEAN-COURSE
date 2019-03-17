import { Component, Output, EventEmitter } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create-component.html',
  styleUrls: ['./post-create-component.css']
})
export class PostCreateComponent {
  enteredContent = '';
  enteredTitle = '';
  @Output() postCreated = new EventEmitter<Post>();


  /* property binding and string interpolation
  onAddPost(postInput: HTMLTextAreaElement) {
    console.log(postInput);
    this.newPost = postInput.value;
  } */

  /* two way binding */
  onAddPost(form: NgForm) {
    const post: Post = {
        title: form.value.title,
        content: form.value.content}
        ;
    this.postCreated.emit(post);
  }
}
