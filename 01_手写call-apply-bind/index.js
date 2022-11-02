// 手写call
Function.prototype.myCall = function(context) {
    // 判断使用myCall方法的当前对象是不是函数
    if (typeof this !== 'function') {
        throw new Error('不是函数哦')
    }

    // 判断是否传递this对象, 没有则使用window
    context = context || window

    // 为当前传递的this对象, 创建使用myCall方法的对象
    context.fn = this

    // 存在第二个参数, 则调用[].slice.call使argument转真数组并调用函数, 否则直接调用函数
    // 1. 任何方法使用call, 第一个参数属于call本身, 后面的参数属于函数形参个数
    // 2. [].slice.call(arguments) 等价于 Array.prototype.slice.call(arguments)：伪数组转真数组, arguments继承slice原型数组成员方法所属的this
    // 3. [].slice.call(arguments, 1)：arguments继承真数组, 并且调用slice方法减去第一个this对象
    arguments[1] ? context.fn(...[].slice.call(arguments, 1)) : context.fn()

    // 调用完成后删除当前this对象创建的新函数
    delete context.fn()
}

// 手写apply
Function.prototype.myApply = function(context) {
    if (typeof this !== 'function') {
        throw new Error('不是函数哦')
    }
    context = context || window
    context.fn = this
    // 由于myApply第二个参数使用的是数组, 所以不需要[].slice.call()去掉第一个并转数组
    arguments[1] ? context.fn(...arguments[1]) : context.fn()
    delete context.fn
}

// 手写bind
Function.prototype.myBind = function(context) {
    if (typeof this !== 'function') {
        throw new Error('不是函数哦')
    }
    context = context || window
    // myBind与其余两个this指向方法不同, 这里不会直接调用函数
    let argu = arguments[1] ? [].slice.call(arguments, 1) : []
    return (...test) => {
        // bind内部使用了apply
        this.apply(context, argu.concat(test))
    }
}

let obj1 = {
    hello(){
        console.log('你好我是一个对象')
        console.log('实际对象this => ', this)
    },
    world(name, age){
        console.log(`我名字叫${name}, 我今年${age}岁`)
        console.log('实际对象this => ', this)
    }
}
let obj2 = {
    test: '测试一下'
}

obj1.world.myCall(obj2, '周杰伦', 23)
obj1.world.myApply(obj2, ['周杰伦', 23])
obj1.world.myBind(obj2, '周杰伦', 23)()