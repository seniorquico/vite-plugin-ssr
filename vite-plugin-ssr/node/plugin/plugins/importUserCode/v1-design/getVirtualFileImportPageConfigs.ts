export { getVirtualFileImportPageConfigs }

import { getConfigData } from './getConfigData'
import type { ConfigVpsResolved } from '../../../../../shared/ConfigVps'
import { serializePageConfigs } from './serializePageConfigs'

async function getVirtualFileImportPageConfigs(
  userRootDir: string,
  isForClientSide: boolean,
  isDev: boolean,
  id: string,
  configVps: ConfigVpsResolved
): Promise<string> {
  const { pageConfigsData, pageConfigGlobal, configFilesAll } = await getConfigData(
    userRootDir,
    isDev,
    true,
    configVps.extensions
  )
  return serializePageConfigs(pageConfigsData, pageConfigGlobal, isForClientSide, isDev, id, configFilesAll)
}
