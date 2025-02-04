export { assertHookResult }
export { assertObjectKeys }

import { assert, assertUsage, isPlainObject, stringifyStringArray } from './utils'
import { assertPageContextProvidedByUser } from './assertPageContextProvidedByUser'

type HookName = 'render' | 'onBeforeRender'

function assertHookResult<Keys extends readonly string[]>(
  hookResult: unknown,
  hookName: HookName,
  hookResultKeys: Keys,
  hookSrc: string,
  canBePromise = false
): asserts hookResult is undefined | null | { [key in Keys[number]]?: unknown } {
  assert(!hookName.endsWith(')'))
  const errPrefix = `The ${hookName}() hook defined by ${hookSrc}`
  assertUsage(
    hookResult === null || hookResult === undefined || isPlainObject(hookResult),
    `${errPrefix} should return \`null\`, \`undefined\`, or a plain JavaScript object.`
  )
  if (hookResult === undefined || hookResult === null) {
    return
  }
  assertObjectKeys(hookResult, hookResultKeys, errPrefix)
  if ('pageContext' in hookResult) {
    assertPageContextProvidedByUser(hookResult['pageContext'], {
      hook: { hookName, hookSrc },
      canBePromise
    })
  }
}

function assertObjectKeys<Keys extends readonly string[]>(
  obj: Record<string, unknown>,
  keysExpected: Keys,
  errPrefix: string
): asserts obj is { [key in Keys[number]]?: unknown } {
  const keysUnknown: string[] = []
  const keys = Object.keys(obj)
  for (const key of keys) {
    if (!keysExpected.includes(key)) {
      keysUnknown.push(key)
    }
  }
  assertUsage(
    keysUnknown.length === 0,
    [
      errPrefix,
      'returned an object with unknown keys',
      stringifyStringArray(keysUnknown) + '.',
      'Only following keys are allowed:',
      stringifyStringArray(keysExpected) + '.'
    ].join(' ')
  )
}
