import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { Provider } from 'jotai'
import { isServer } from '@penx/constants'
import { useWorkers } from '@penx/hooks'
import { db } from '@penx/local-db'
import { sleep } from '@penx/shared'
import * as storageEstimate from '@penx/storage-estimate'
import { JotaiNexus, store } from '@penx/store'
import { ClientOnly } from './components/ClientOnly'
import { EditorLayout } from './EditorLayout/EditorLayout'
import { penx } from './penx'

const builtins = [
  { id: 'storage-estimate', activate: storageEstimate.activate },
]

if (!isServer) {
  window.penx = penx as any

  window.onload = async () => {
    for (const plugin of builtins) {
      const ctx = Object.create(window.penx, {
        pluginId: {
          writable: false,
          configurable: false,
          value: plugin.id,
        },
      })
      plugin.activate(ctx)
    }

    await sleep(10)
    const count = await db.doc.count()
    const spaceCount = await db.space.count()
    console.log('count:', count, 'spaceCount:', spaceCount)

    const plugins = await db.listPlugins()
    console.log('init plugin===========:', plugins)
    for (const item of plugins) {
      // eval(`
      // ${item.code}
      //   activate(Object.create(penx, {
      //     pluginId: {
      //         writable: false,
      //         configurable: false,
      //         value: "${item.manifest.id}"
      //       }
      //   }))
      // `)
      const script = document.createElement('script')
      script.type = 'module'

      script.innerHTML = `
        ${item.code}
        
        const ctx = Object.create(window.penx, {
          pluginId: {
              writable: false,
              configurable: false,
              value: "${item.manifest.id}"
            }
        })

        activate(ctx)
      `
      document.body.appendChild(script)
    }
  }
}

export const EditorApp: FC<PropsWithChildren> = ({ children }) => {
  useWorkers()

  useEffect(() => {
    persist()
      .then((d) => {
        //
      })
      .catch((e) => {
        //
      })
  }, [])

  return (
    <ClientOnly>
      <Provider store={store}>
        <JotaiNexus />
        <EditorLayout />
      </Provider>
    </ClientOnly>
  )
}

async function persist() {
  if (navigator.storage && navigator.storage.persist) {
    return navigator.storage.persist()
  }
}
