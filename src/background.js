/* eslint-disable */
import './background/pollyfill'
/* eslint-enable */

import React from 'react'
import ReactDOM from 'react-dom'
import { alarmReducer, initAlarms } from './background/alarm'
import { initIdentity } from './background/identity'
import { injectScript } from './background/inject'
import { reducer } from './background/message-reducer'
import { onNotificationClicked } from './background/notifications'
import { injectTracking } from './background/tracking'
import { BackgroundApp } from './components/background-app'
import { composePromises } from './lib/async-helpers'
import {
  onMessage,
  alarms,
  webNavigation,
  notifications,
} from './lib/extension'
import { identify } from './lib/mujo-sdk'

const element = document.createElement('div')
document.body.appendChild(element)
const startReactApp = () => {
  ReactDOM.render(<BackgroundApp />, element)
}

const init = composePromises(
  initAlarms,
  identify,
  initIdentity,
  startReactApp
)

notifications.onClicked.addListener(onNotificationClicked)
alarms.onAlarm.addListener(alarmReducer)
// NOTE: Most functionlity will probably stem from the reducer
onMessage(reducer)
webNavigation.onCommitted.addListener(injectScript)

init()
injectTracking('GTM-P5PFGSF', window.document)
