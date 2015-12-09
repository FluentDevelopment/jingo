module.exports = (function() {
  var _ = require("lodash"),
      fs = require("fs"),
      path = require("path"),
      gitmech = require("./gitmech");

  function categoriesToString(categories) {
    return JSON.stringify(categories, null, 4);
  }

  function writeCategoryFile(filePath, categories) {
    console.log("Writing categories file: ", filePath, categories, categoriesToString(categories));
    try {
      fs.writeFileSync(filePath, categoriesToString(categories));
      console.log("Categories file created: ", filePath);
    } catch (e) {
      console.log("Error creating categories file");
      console.log(err);
      process.exit(-1);
    }
  }

  function testReadWrite(filePath) {
    /*
      Test read & write - fs.access (fs.R_OK | fs.W_OK) doesn't work properly on windows
    */
    var writeOK = false,
        readOK = false,
        contents;

    try {
      contents = require(filePath);
      readOK = true;
    } catch (e) { /* Do Nothing */ }

    try {
      fs.writeFileSync(filePath, categoriesToString(contents));
      writeOK = true;
    } catch (e) { /* Do Nothing */ }

    if (!readOK || !writeOK) {
      var errorMessage = "Cannot ";
      if (!readOK) {
        errorMessage += "read ";
      }
      if (!writeOK) {
        errorMessage += (((!readOK) ? "or ": "") + "write ");
      }
      errorMessage += "to " + self.getFilePath();

      console.log(errorMessage);
      process.exit(-1);
    } else {
      return contents;
    }
  }

  return {
    _filename: "categories.json",
    _fullpath: undefined,
    _categories: require("./config").defaultCategoryConfig,
    _config: undefined,
    getFilename: function() { return this._filename; },
    getConfig: function() {
      if (!this._config) {
        this._config = require("./configurable").prototype.getConfig();
      }
      return this._config;
    },
    getFilePath: function() { return path.join(this.getConfig().application.repository, this._filename); },
    initialize: function () {
      if (!this.getConfig().features.categories) {
        return {};
      }

      var fileExists = true,
          categoriesContents;
      try {
        fs.accessSync(this.getFilePath(), fs.F_OK);
      } catch (e) {
        fileExists = false;
      }
      
      if (!fileExists) {
        writeCategoryFile(this.getFilePath(), this._categories);
      } else {
        categoriesContents = testReadWrite(this.getFilePath());
      }

      this._categories = _.merge(this._categories, categoriesContents);

      return this._categories;
    },
    categoryExists: function(category) {
      return this._categories.list.hasOwnProperty(category);
    },
    pagesWithCategory: function(category) {
      var pages = [];
      console.log("Not yet implemented - categories.pagesWithCategory");
      return pages;
    }
  };
})();
