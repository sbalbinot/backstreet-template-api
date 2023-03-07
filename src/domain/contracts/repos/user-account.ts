export interface LoadUserAccount {
  load: (input: LoadUserAccount.Input) => Promise<LoadUserAccount.Output>
}

export namespace LoadUserAccount {
  export type Input = { email: string }
  export type Output = undefined | { id: string, name: string, password: string }
}

export interface CheckUserAccount {
  check: (input: CheckUserAccount.Input) => Promise<CheckUserAccount.Output>
}

export namespace CheckUserAccount {
  export type Input = { email: string }
  export type Output = boolean
}

export interface SaveUserAccount {
  save: (input: SaveUserAccount.Input) => Promise<SaveUserAccount.Output>
}

export namespace SaveUserAccount {
  export type Input = {
    id?: string
    name: string
    email: string
    password: string
  }
  export type Output = { id: string }
}
