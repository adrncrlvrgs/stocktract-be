const prisma = require("utils/prismaClient");

class User {
  static async findAll() {
    return await prisma.user.findMany();
  }
  static async create(data){
    return await prisma.user.create({data})
  }
}

// async function createUser(data) {
//   try {
//     const user = prisma.user.create({ data });
//     return user;
//   } catch (e) {
//     throw e;
//   }
// }

module.exports = User
