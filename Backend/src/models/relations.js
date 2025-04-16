import { Tasks } from "./tasks.js";
import { Users } from "./users.js";
import { Category } from "./category.js"; 

export const defineRelations = () => {
  Users.hasMany(Tasks, { foreignKey: "userId" });
  Tasks.belongsTo(Users, { foreignKey: "userId" });

  Users.hasMany(Category, {foreignKey: "userId"})
  Category.belongsTo(Users, {foreignKey: "userId"})

  Category.hasMany(Tasks, {foreignKey: "categoryId"})
  Tasks.belongsTo(Category, {foreignKey: "categoryId"})

};
