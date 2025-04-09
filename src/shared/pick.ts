const pick = <T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]) => {
    const finalObj: Partial<T> = {}
    for (const key of keys) {
        if (obj && Object.hasOwnProperty.call(obj, key)) {
            //   console.log({ key })
            finalObj[key] = obj[key]
        }
    }
    // console.log({ finalObj })
    return finalObj;
}
export default pick;