export type Token<T> = symbol & { readonly __type?: T }
export type Lifetime = 'singleton' | 'transient'
export type Value<T> = T
export type Factory<T> = () => T
export type ValueOrFactory<T> = Value<T> | Factory<T>
export type Provider<T> =
  | {
      type: 'value'
      value: Value<T>
    }
  | {
      type: 'factory'
      lifetime: Lifetime
      factory: Factory<T>
      instance?: T
      initialized: boolean
    }
