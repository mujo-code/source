import { renderHook, act } from '@testing-library/react-hooks'
import { ACTIVE_PRODUCT, CANCELLED_PRODUCT } from '../constants'
import {
  useSubscription,
  activeProducts,
  SubscriptionProvider,
} from './use-subscription'

jest.mock('../lib/payment')
/* eslint-disable-next-line import-order-alphabetical/order */
const { getPurchases, getProducts, buy } = require('../lib/payment')

const hookOptions = { wrapper: SubscriptionProvider }

beforeEach(() => {
  getPurchases.mockReset()
  getProducts.mockReset()
  buy.mockReset()
})

test('activeProduct should filter to only active products', () => {
  const products = [
    { state: ACTIVE_PRODUCT },
    { state: CANCELLED_PRODUCT },
  ]
  expect(activeProducts(products)).toHaveLength(1)
})

test('useSubscription should initialize products and purchases', async () => {
  getPurchases.mockResolvedValue([{ state: ACTIVE_PRODUCT }])
  getProducts.mockResolvedValue(['foo', 'bar'])
  const { result, waitForNextUpdate } = renderHook(
    () => useSubscription(),
    hookOptions
  )
  // Two updates [product, user]
  await waitForNextUpdate()
  expect(result.current.user.isSubscribed).toBe(true)
  expect(result.current.user.products).toEqual([
    { state: ACTIVE_PRODUCT },
  ])
  expect(result.current.products).toEqual(['foo', 'bar'])
})

test('useSubscription should be unsubbed if not active product', async () => {
  getPurchases.mockResolvedValue([{ state: CANCELLED_PRODUCT }])
  getProducts.mockResolvedValue(['foo', 'bar'])
  const { result, waitForNextUpdate } = renderHook(
    () => useSubscription(),
    hookOptions
  )
  // Two updates [product, user]
  await waitForNextUpdate()
  expect(result.current.user.isSubscribed).toBe(false)
})

test('useSubscription a failure to buy should set purchaseError', async () => {
  getPurchases.mockResolvedValue([])
  getProducts.mockResolvedValue([])
  buy.mockRejectedValue(new Error('fail'))
  const { result, waitForNextUpdate } = renderHook(
    () => useSubscription(),
    hookOptions
  )
  // Init calls
  await waitForNextUpdate()
  act(() => {
    result.current.buy('foo')
  })
  // Update error
  await waitForNextUpdate()
  expect(result.current.purchaseError.message).toBe('fail')
})
