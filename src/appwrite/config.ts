import config from '@/config/config'
import { Account, Client, ID } from 'appwrite'

type CreateUserAccount = {
   email: string
   password: string
   name: string
}

type LoginUserAccount = {
   email: string
   password: string
}

const appwriteClient = new Client()

appwriteClient.setEndpoint(config.appwriteUrl).setProject(config.appwriteProjectId)

export const account = new Account(appwriteClient)

export class AppwriteService {
   // create a new record of user inside appwrite
   async createUserAccount({ email, password, name }: CreateUserAccount) {
      try {
         const userAccount = await account.create(ID.unique(), email, password, name)

         if (userAccount) {
            return this.login({ email, password })
         } else {
            return userAccount
         }
      } catch (err) {
         throw err
      }
   }

   async login({ email, password }: LoginUserAccount) {
      try {
         return await account.createEmailSession(email, password)
      } catch (err) {
         throw err
      }
   }

   async isLoggedIn(): Promise<boolean> {
      try {
         const data = await this.getCurrentUser()
         return Boolean(data)
      } catch (err) {
         throw err
      }
   }

   async getCurrentUser() {
      try {
         return await account.get()
      } catch (err) {
         console.log('getCurrentUser error: ', err)
      }
   }

   async logout() {
      try {
         await account.deleteSession('current')
      } catch (err) {
         console.log('logout error: ', err)
      }
   }
}

const appwriteService = new AppwriteService()

export default appwriteService
