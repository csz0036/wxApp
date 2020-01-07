
export default class TimerQueue {
  /**
   * @return {number}
   */
  constructor () {
    this.queue = {}
    this.timer = -1
  }

  /*
  * timer
  * 0 -> 运行中
  * -1 -> 停止
  * */
  action () {
    if (JSON.stringify(this.queue) !== '{}') {
      for (let i in this.queue) {
        this.queue[i][0]()
      }
      this.timer = -1
      this.begin()
    } else {
      this.stop()
    }
  }

  add (act) {
    const key = `${new Date().getTime()}${Math.ceil(Math.random() * 10000)}`
    this.queue[`${key}`] = [act]
    if (this.timer === -1) {
      this.start()
    }
    return key
  }

  remove (key) {
    delete this.queue[`${key}`]
    if (JSON.stringify(this.queue) === '{}') {
      this.timer = -1
    }
  }

  stop () {
    clearTimeout(this.timer)
    this.timer = -1
  }

  start () {
    if (this.timer > -1) return
    this.action()
  }

  begin(){
    this.timer = setTimeout(() => {
      this.action()
    }, 1000)
  }
}
