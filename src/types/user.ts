export enum UserRole {
  AUTHOR = 'AUTHOR',
  CREATOR = 'CREATOR',
  LEARNER = 'LEARNER',
  ADMIN = 'ADMIN',
}

export type TUser = {
  id: string
  user_id?: string
  email: string
  first_name: string
  last_name: string | null
  role: UserRole
  is_active: boolean
}
