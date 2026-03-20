import PocketBase from 'pocketbase'

let pb: PocketBase

export function getPocketBase() {
    if (!pb) {
        pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL)
        pb.autoCancellation(false)
    }
    return pb
}

// Export pre-initialized instance for general use
const pbInstance = getPocketBase()
export default pbInstance
