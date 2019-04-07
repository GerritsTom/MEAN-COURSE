import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  styleUrls: ['./post-list.component.css'],
  templateUrl: './post-list.component.html'
})
export class PostListComponent implements OnInit, OnDestroy {
  // @Input() posts: Post[] = [];
  posts: Post[] = [];
  private postsSub: Subscription;
  isLoading = false;
  private authListnerSubs: Subscription;
  userIsAuthenticated = false;

  constructor(public postsService: PostsService, private authService: AuthService) {}

  ngOnInit(): void {
    // this.posts = this.postsService.getPosts();
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });

    this.userIsAuthenticated = this.authService.getIsAuth();

    this.authListnerSubs = this.authService.getAuthStatusListener().subscribe(
        isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
        }
      );
  }

  /*
  posts = [{title: 'First Post', content: 'This is the first post'},
          {title: 'Second Post', content: 'This is the second post'},
          {title: 'Third Post', content: 'This is the third post'}] */

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
    this.authListnerSubs.unsubscribe();
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }
}
