class IdleTimer {
    constructor({ timeout, onTimeout }){
        this.timeout = timeout
        this.onTimeout = onTimeout
        this.eventHandler = this.updateExpiredTime.bind(this)
        this.tracker();
        this.startInterval()
    }

    startInterval(){
        this.updateExpiredTime()
        this.interval = setInterval(()=>{
            const expiredTime = parseInt(localStorage.getItem('_expiredTime') || 0, 10);
            if(expiredTime < Date.now()){
                console.log("Timeout");
                if(this.onTimeout){
                    this.onTimeout();
                    this.cleanup();
                }

            }
        }, 1000)

    }

    updateExpiredTime() {
        localStorage.setItem("_expiredTime", Date.now() + this.timeout * 1000);
    }

    tracker() {
        window.addEventListener("mousemove", this.eventHandler)
        window.addEventListener("scroll", this.eventHandler)
        window.addEventListener("keydown", this.eventHandler)
    }

    cleanup() {
        clearInterval(this.interval)
        window.addEventListener("mousemove", this.eventHandler)
        window.addEventListener("scroll", this.eventHandler)
        window.addEventListener("keydown", this.eventHandler)
    }

}

export default IdleTimer;