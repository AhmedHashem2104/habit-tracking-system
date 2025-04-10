import "@auth0/auth0-react"

declare module "@auth0/auth0-react" {
  export interface Auth0ProviderOptions {
    domain: string
    clientId: string
    authorizationParams?: {
      redirect_uri?: string
      audience?: string
      scope?: string
    }
  }
}
