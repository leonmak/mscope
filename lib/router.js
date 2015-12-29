Router.configure({
  layoutTemplate:"layout",
  loadingTemplate: 'loading',
  waitOn: function() { return Meteor.subscribe('posts'); }
  // notFoundTemplate:"notFoundTemplate",
  // loadingTemplate:"loadingTemplate",
  // yieldRegions:{
  //   "myAside": {to: "aside"},
  //   "myHeader": {to: "header"}
  //   "myFooter": {to: "footer"}
  // }
});
Router.route('/', {name: 'postsList'});
