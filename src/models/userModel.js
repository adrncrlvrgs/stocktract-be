import prisma from "../utils/prismaClient.js";

class User {
  static async findAll() {
    return await prisma.user.findMany();
  }
  /**
   * @param {{ name: any; email: any; password: any; }} data
   */
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

export default User
