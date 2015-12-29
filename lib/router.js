Router.configure({
  layoutTemplate:"layout",
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() {
    return [Meteor.subscribe('posts'), Meteor.subscribe('comments')];
  }
});
Router.route('/', {
  name: 'postsList'
});

// POST
Router.route('/posts/:_id', {
  name: 'postPage',
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

// UPDATE & DELETE
Router.route('/posts/:_id/edit', {
  name: 'postEdit',
  data: function() { return Posts.findOne(this.params._id); }
});

// END UPDATE & DELETE
