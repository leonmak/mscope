Router.configure({
  layoutTemplate:"layout",
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() { return Meteor.subscribe('posts'); }
  // notFoundTemplate:"notFoundTemplate",
  // loadingTemplate:"loadingTemplate",
  // yieldRegions:{
  //   "myAside": {to: "aside"},
  //   "myHeader": {to: "header"}
  //   "myFooter": {to: "footer"}
  // }
});
Router.route('/', {
  name: 'postsList'
});

Router.route('/posts/:_id', {
  name: 'postPage',
  data: function() { return Posts.findOne(this.params._id); }
});

Router.onBeforeAction('dataNotFound', {only: 'postPage'});
// posts/ is valid but eg. /posts/234223  is not valid
// invalid postPage routes go to notFoundTemplate
