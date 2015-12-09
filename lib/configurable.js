var _ = require("lodash"),
    app = require("./app"),
    fs = require("fs");

var Configurable = function () {
  this.config = {};
  this.categories = {};
  this.overrides = {};
};

Configurable.prototype.configOverride = function (snippet) {
  this.overrides = snippet ? _.extend(this.overrides, snippet) : {};
};

Configurable.prototype.getConfig = function () {
  
  try {
    this.config = _.clone(app.getInstance().locals.config.get(), true);
  } catch (e) {
    this.config = _.clone(require("./config").defaults, true);
  }
  return _.merge(this.config, this.overrides);
};

Configurable.prototype.getCategories = function () {
  try {
    this.categories = require("../categories.json");
  } catch (e) {
    //Do nothing 
  }  
  this.categories = _.merge(require("./config").defaultCategories, this.categories);
  fs.writeFile('../categories.json', JSON.stringify(this.categories, null, 4), function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Categories saved"); 
    } 
  }); 
  return this.categories;
};

module.exports = Configurable;
