import './config/module-alias'
import { env } from '@/main/config/env'
import { MongoConnection } from '@/infra/repos/mongodb/helpers'

MongoConnection.getInstance().connect(env.mongoUrl)
  .then(async () => {
    const { app } = await import('@/main/config/app')
    app.listen(env.port, () => { console.log(`Server running at http://localhost:${env.port}`) })
  })
  .catch(console.error)
