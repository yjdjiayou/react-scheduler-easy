import {
  scheduleCallback,
  shouldYield,
  ImmediatePriority,
  UserBlockingPriority,
  NormalPriority,
  LowPriority,
  IdlePriority,
  cancelCallback,
} from "./scheduler";

let result = 0;
let i = 0;
/**
 * 要想能够方便的让任务能够 暂停和恢复 ，需要数据结构支持
 * @returns
 */
function calculate(didTimeout) {
  if (i === 0) {
    console.log("开始calculate");
  }
  //shouldYield 浏览器分配的时间片5ms已经到期了，就会放弃本任务的执行
  //把线程的资源交还给浏览器，让浏览器执行更高优先级的工作，比如页面绘制，响应用户输入
  // didTimeout 为true，说明任务到期了，这个时候需要执行该任务
  for (; i < 1000 && (!shouldYield() || didTimeout); i++) {
    result += 1;
  }
  //当退出本任务的时候，如果任务没有完成，返回任务函数本身，如果任务完成了就返回null
  if (i < 1000) {
    return calculate;
  } else {
    console.log("result", result);
    return false;
  }
}

let result2 = 0;
let i2 = 0;
/**
 * 要想能够方便的让任务能够 暂停和恢复 ，需要数据结构支持
 * @returns
 */
function calculate2(didTimeout) {
  if (i2 === 0) {
    console.log("开始calculate2");
  }
  //shouldYield 浏览器分配的时间片5ms已经到期了，就会放弃本任务的执行
  //把线程的资源交还给浏览器，让浏览器执行更高优先级的工作，比如页面绘制，响应用户输入
  for (; i2 < 2000 && (!shouldYield() || didTimeout); i2++) {
    result2 += 1;
  }
  //当退出本任务的时候，如果任务没有完成，返回任务函数本身，如果任务完成了就返回null
  if (i2 < 2000) {
    return calculate2;
  } else {
    console.log("result2", result2);
    return false;
  }
}
scheduleCallback(ImmediatePriority, calculate);
//有些时候我不想让这个任务立刻开始，而是希望它延迟一段开始
const task = scheduleCallback(LowPriority, calculate2, { delay: 100000 });
//cancelCallback(task);
