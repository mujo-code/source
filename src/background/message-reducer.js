import {
  NEW_TAB_CONNECTION,
  CLEAR_ALARM,
  SET_ALARM,
  PAGE_VIEWING_TIME,
  GET_STORAGE,
  SET_STORAGE,
  DEEP_LINK_NEWTAB,
} from '../constants'
import { tabs } from '../lib/extension'
import {
  updateUserActivity,
  clearAlarm,
  clearActivityTimeout,
} from './alarm'
import { updateScreenTime } from './screen-time'
import { onGetStorage, onSetStorage } from './storage'

export const reducer = (request, sender, sendResponse) => {
  const { event } = request
  switch (event) {
    case NEW_TAB_CONNECTION:
    case SET_ALARM:
      updateUserActivity()
      break
    case CLEAR_ALARM:
      clearAlarm()
      clearActivityTimeout()
      break
    case PAGE_VIEWING_TIME:
      updateScreenTime(sender.url, request.measure)
      break
    case GET_STORAGE:
      onGetStorage(request.key, sendResponse)
      break
    case SET_STORAGE:
      onSetStorage(request.key, request.value, sendResponse)
      break
    case DEEP_LINK_NEWTAB: {
      const { url, tab } = sender
      tabs.update(tab.id, { url: `chrome://newtab?site=${url}` })
      break
    }
    default:
  }
}
