import { curry } from './functional'

export const set = curry((obj, key, value) => {
  Object.assign(obj, { [key]: value })
})

export const create = curry((obj, key, value) =>
  Object.assign({}, obj, { [key]: value })
)

export const toString = x => `${x}`
export const toLowerCase = x => String.prototype.toLowerCase.call(x)
export const toDashCase = x =>
  toString(x)
    .split(/_|\s/gi)
    .map(toLowerCase)
    .join('-')
