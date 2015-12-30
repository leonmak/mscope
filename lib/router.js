Router.configure({
  layoutTemplate:"layout",
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() {
    return [Meteor.subscribe('notifications')];
  }
});


// POST
Router.route('/posts/:_id', {
  name: 'postPage',
  waitOn: function() {
    return [
      Meteor.subscribe('singlePost', this.params._id),
      Meteor.subscribe('comments', this.params._id)
    ];
  },
  data: function() { return Posts.findOne(this.params._id); }
});

Router.onBeforeAction('dataNotFound', {only: 'postPage'});
// posts/ is valid but eg. /posts/234223  is not valid
// invalid postPage routes go to notFoundTemplate

Router.route('/submit', {name: 'postSubmit'});

var requireLogin = function() {
  if (! Meteor.user()) {
    this.render('accessDenied');
  } else {
    this.next();
  }
};
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});
// END POST


// PAGINATED GET ROUTE AFTER :_id, id is more specific than limit number
PostsListController = RouteController.extend({
  template: 'postsList',
  increment: 5,
  postsLimit: function() {
    return parseInt(this.params.postsLimit) || this.increment;
  },
  findOptions: function() {
    // return {sort: {submitted: -1}, limit: this.postsLimit()};
    return {sort: this.sort, limit: this.postsLimit()};

  },
  // waitOn: function() {
  //   return Meteor.subscribe('posts', this.findOptions());
  subscriptions: function() { // NOT RETURNING, which makes it go to top
    this.postsSub = Meteor.subscribe('posts', this.findOptions());
  },
  posts: function() {
    return Posts.find({}, this.findOptions());
  },
  data: function() {
    // for the button, check if what was returned from the db is what we asked how
    // var hasMore = this.posts().count() === this.postsLimit();
    // var nextPath = this.route.path({postsLimit: this.postsLimit() + this.increment});
    var self = this;
    return {
      posts: self.posts(),
      ready: self.postsSub.ready,
      nextPath: function() {
        if (self.posts().count() === self.postsLimit())
          return self.nextPath();
      }
    };
  }
});

// Router.route('/:postsLimit?', {
//   name: 'postsList'
// });

NewPostsController = PostsListController.extend({
  sort: {submitted: -1, _id: -1}, //order by earliest
  nextPath: function() {
    return Router.routes.newPosts.path({postsLimit: this.postsLimit() + this.increment});
  }
});

BestPostsController = PostsListController.extend({
  sort: {votes: -1, submitted: -1, _id: -1}, // order by votes, then earliest
  nextPath: function() {
    return Router.routes.bestPosts.path({postsLimit: this.postsLimit() + this.increment});
  }
});

Router.route('/', {
  name: 'home',
  controller: NewPostsController
});

Router.route('/new/:postsLimit?', {name: 'newPosts'});

Router.route('/best/:postsLimit?', {name: 'bestPosts'});

// END GET ROUTE


// UPDATE & DELETE
Router.route('/posts/:_id/edit', {
  name: 'postEdit',
  waitOn: function() {
    return Meteor.subscribe('singlePost', this.params._id);
  },
  data: function() { return Posts.findOne(this.params._id); }
});

// END UPDATE & DELETE
