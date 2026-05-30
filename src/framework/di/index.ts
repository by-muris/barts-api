import type {
  Provider,
  Token,
  Lifetime,
  ValueOrFactory,
  Factory,
  Value,
} from '@/framework/di/types'

const container = new Map<symbol, Provider<unknown>>()

export function register<T>(key: Token<T>, value: Value<T>): void
export function register<T>(
  key: Token<T>,
  factory: Factory<T>,
  options?: { lifetime?: Lifetime },
): void

export function register<T>(
  key: Token<T>,
  valueOrFactory: ValueOrFactory<T>,
  options?: { lifetime?: Lifetime },
): void {
  if (typeof valueOrFactory === 'function') {
    container.set(key, {
      type: 'factory',
      factory: valueOrFactory as Factory<T>,
      lifetime: options?.lifetime ?? 'transient',
      initialized: false,
    })
  } else {
    container.set(key, {
      type: 'value',
      value: valueOrFactory as Value<T>,
    })
  }
}

export function inject<T>(token: Token<T>): T {
  const provider = container.get(token) as Provider<T> | undefined

  if (!provider) {
    throw new Error(
      `Failed to obtain provider with key '${token.description}' - Did you forget to call 'register'?`,
    )
  }

  // Values
  if (provider.type === 'value') {
    return provider.value
  }

  // Transient always creates new instance
  if (provider.lifetime === 'transient') {
    return provider.factory()
  }

  // Singletons initialise on first inject
  if (!provider.initialized) {
    provider.instance = provider.factory()
    provider.initialized = true
  }

  return provider.instance as T
}

export function token<T>(description: string): Token<T> {
  return Symbol(description) as Token<T>
}

export type { Factory, Lifetime, Token, Value } from '@/framework/di/types'
