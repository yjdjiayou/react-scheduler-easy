//将要被调度的回调函数 全局变量 新的任务会覆盖老的任务
let scheduledHostCallback = null;
const messageChannel = new MessageChannel();
messageChannel.port1.onmessage = performWorkUntilDeadline;
let deadline = 0;
let yieldInterval = 5; //每一帧我会申请5ms
let taskTimeoutId;
export function getCurrentTime() {
  return performance.now();
}
/**
 * 执行任务到截止时间
 */
function performWorkUntilDeadline() {
  //获取当前时间
  const currentTime = getCurrentTime();
  //计算截止时间
  deadline = currentTime + yieldInterval;
  //如果hasMoreWork为true，说明工作没干完，就被打断了放弃了，后还得接着干
  const hasMoreWork = scheduledHostCallback(currentTime);
  //如果工作没干完，再发个一个消息，它会让浏览器再添加一个宏任务performWorkUntilDeadline，会在下一帧开始的时候执行
  if (hasMoreWork) {
    messageChannel.port2.postMessage(null);
    //requestAnimationFrame(performWorkUntilDeadline);
  }
}
export function requestHostCallback(callback) {
  scheduledHostCallback = callback;
  //一旦port2发消息了，会向宏任务队列中添加一个宏任务，执行por1.onmessage方法
  //告诉 浏览器在下一帧执行performWorkUntilDeadline
  messageChannel.port2.postMessage(null);
  
  // 也可以使用
  // Scheduler periodically yields in case there is other work on the main
  // thread, like user events. By default, it yields multiple times per frame.
  // It does not attempt to align with frame boundaries, since most tasks don't
  // need to be frame aligned; for those that do, use requestAnimationFrame.
  //requestAnimationFrame(performWorkUntilDeadline);
}

export function shouldYieldToHost() {
  //获取当前时间
  const currentTime = getCurrentTime();
  //如果当前时间大于截止时间了，说明到期了，时间片已经用完了，需要返回true,放弃 执行了
  return currentTime >= deadline;
}

export function requestHostTimeout(callback, ms) {
  taskTimeoutId = setTimeout(() => {
    callback(getCurrentTime());
  }, ms);
}
