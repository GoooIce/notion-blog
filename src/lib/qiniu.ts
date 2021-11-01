import qiniu from 'qiniu'

const QINIU_AK = process.env.QINIU_AK
const QINIU_SK = process.env.QINIU_SK

const mac = new qiniu.auth.digest.Mac(QINIU_AK, QINIU_SK)
const config = new qiniu.conf.Config()
const bucketManager = new qiniu.rs.BucketManager(mac, config)
const publicBucketDomain = 'http://models.miantu.net'

export async function fetch(url: string, id: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    bucketManager.fetch(url, 'miantu', id, function (err, respBody, respInfo) {
      if (err) {
        console.log(err)
        // throw err;
      } else {
        if (respInfo.statusCode == 200) {
          resolve(
            bucketManager.publicDownloadUrl(publicBucketDomain, respBody.key)
          )
        } else {
          reject({ code: respInfo.statusCode, body: respBody })
        }
      }
    })
  })
}
