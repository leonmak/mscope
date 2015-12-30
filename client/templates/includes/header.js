Template.header.helpers({
  activeRouteClass: function() {
    var args = Array.prototype.slice.call(arguments, 0);

    args.pop(); // to remove Spacebars.kw hash

    // test if each name in arg array is current route name
    var active = _.any(args, function(name) {
      return Router.current() && Router.current().route.getName() === name;
    });

    return active && 'active';
    // boolean && string pattern.
    // false && myString - false, true && myString - myString
  }
});
