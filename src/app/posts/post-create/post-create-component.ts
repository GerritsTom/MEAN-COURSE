import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  isLoading = false;
  form: FormGroup;
  imagePreview: string | ArrayBuffer;

  // @Output() postCreated = new EventEmitter<Post>(); we use dependency injection through sercives

  ngOnInit(): void {

    // init form
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)] } ),
      content: new FormControl(null, {validators: [Validators.required] } ),
      image: new FormControl(null, {validators: [Validators.required] } )
    });

    this.route.paramMap
    .subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        // synchronous this.post = this.postsService.getPost(this.postId);
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {id: postData._id, title: postData.title, content: postData.content};
          this.form.setValue({title: this.post.title, content: this.post.content});
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
  onSavePost() {
    /*
    const post: Post = {
        title: form.value.title,
        content: form.value.content}
        ; */
    // this.postCreated.emit(post);
    /*
    if (this.form.invalid) {
      return;
    } */

    console.log('>>> Title ' + this.form.value.title);
    console.log('>>> Content ' + this.form.value.content);

    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(this.form.value.title, this.form.value.content);
    } else {
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content);
    }

    // reset the form
    // this.form.resetForm();
    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);

  }
}
