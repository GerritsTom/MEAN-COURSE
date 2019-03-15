import { Component } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create-component.html'
})
export class PostCreateComponent {
  enteredValue = '';
  newPost = 'NO CONTENT';

  /* property binding and string interpolation
  onAddPost(postInput: HTMLTextAreaElement) {
    console.log(postInput);
    this.newPost = postInput.value;
  } */

  /* two way binding */
  onAddPost() {
    this.newPost = this.enteredValue;
  }
}
