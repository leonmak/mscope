Meteor.publish('posts', function(author) {
  return Posts.find({},{fields:{title:0}});
});
