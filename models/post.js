"use strict";

module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define("Post", {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    AuthorId: {
            type: DataTypes.INTEGER,
            foreignKey: true
        },
  }, {
    classMethods: {
      associate: function(db) {
        Post.belongsTo(db.Author);
      }
    }
  });

  return Post;
};
