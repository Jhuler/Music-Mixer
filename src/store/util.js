const generarId = (array,prop) => {
    if (prop == undefined) prop = 'id'
    let id, rep

    if (array.length == 0) {
        id = '1'
    } else {
        do {
            id = (array.length + 1) +''+ Math.floor(Math.random() * 100)
            rep = array.find(a => a[prop] == id)
        } while (rep)
    }
    
    return id
}

const openChargeFile = (id) => {
    document.getElementById(id).click()
}

export {generarId, openChargeFile}