let LightStore = {
    lights: [],
    update: []
}

let old = []

function checkDiff() {
    if (old.length === 0 && LightStore.lights.length > 0) {
        for (let i = 0; i < LightStore.lights.length; i++) {
            old.push(LightStore.lights[i])
        }
    }

    if (LightStore.lights.length !== old.length) {
        LightStore.update.unshift(1)
        old.length = 0
        for (let i = 0; i < LightStore.lights.length; i++) {
            old.push(LightStore.lights[i])
        }
    } else {
        for (let i = 0; i < LightStore.lights.length; i++) {
            if (LightStore.lights[i].id !== old[i].id) {
                LightStore.update.unshift(1)
                old.length = 0
                for (let i = 0; i < LightStore.lights.length; i++) {
                    old.push(LightStore.lights[i])
                }
            }
        }
    }
    LightStore.update.unshift(0)
    if (LightStore.update.length > 10) {
        LightStore.update.length = 10
    }
}

setInterval(function () {
    checkDiff()
}, 1000);

export default LightStore