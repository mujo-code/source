import { BodyL } from '@mujo/ui'
import React from 'react'

export const Description = ({ children, hasTitle }) => {
  const isArray = Array.isArray(children)
  return (
    <>
      {isArray ? (
        children.map((paragraph, i) => (
          <BodyL
            marginTop={hasTitle && !i ? 'zero' : 'm'}
            key={`paragraph-${i}`}
          >
            {paragraph}
          </BodyL>
        ))
      ) : (
        <BodyL marginTop={hasTitle ? 'zero' : 'm'}>{children}</BodyL>
      )}
    </>
  )
}
