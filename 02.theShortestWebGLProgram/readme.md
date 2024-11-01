# 最短的WebGL程序

使用背景色清空canvas标签的绘图区


1. 获取`<canvas>`元素
2. 获取WebGL绘图上下文
3. 设置背景色
4. 清空`<canvas>`

## getWebGLContext(canvas) 是WebGL编程有用的辅助函数之一
获取WebGL绘图上下文，如果开启了debug属性，遇到错误时将在控制台显示错误消息

getWebGLContext(element, [, debug])

| 参数        | 描述                                                  |
|-----------|-----------------------------------------------------|
| element   | 指定 canvas 元素                                        |
| debug(可选) | 默认为false，如果设置为true，javascript中发生的错误将被显示在控制台上。它会影响性能 |
| 返回值       | 描述                                                  |
| non-null  | WebGL绘制上下文                                          |
| null      | WebGL 不可用                                           |

## gl.clearColor 指定绘图区的背景色
`gl.clearColor(red,green,blue,alpha)`

一旦指定了背景色之后，背景色就会驻存在WebGL系统中，在下一次调用gl.clearColor()方法前不会改变。


## gl.clear(gl.COLOR_BUFFER_BIT)

函数的参数是`gl.COLOR_BUFFER_BIT`,而不是表示绘图区域的`<canvas>`。因为WebGL中的gl.clear()方法实际上继承自OpenGL，它基于多基本缓冲区模型，和清除二维绘图上下文不一样。
清空绘图区域，实际上是在清空颜色缓冲区（color buffer），传递参数`gl.COLOR_BUFFER_BIT`就是在告诉WebGL清空颜色缓冲区。除了颜色缓冲区，WebGL还会使用其他种类的缓冲区，比如`深度缓冲区`和`模版缓冲区`。

| 参数                    | 描述                           |
|-----------------------|------------------------------|
| buffer                | 指定待清空的缓冲区，为操作符 （｜）可用来指定多个缓冲区 |
| gl.COLOR_BUFFER_BIT   | 指定颜色缓存                       |
| gl.DEPTH_BUFFER_BIT   | 指定深度缓冲区                      |
| gl.STENCIL_BUFFER_BIT | 指定模版缓冲区                      |
| 返回值                   | 无                            |
| 错误                    | 描述                           |
| INVALID_VALUE         | 缓冲区不是以上三种类型                  |

若没有指定背景色，则使用默认值

| 缓冲区名称 | 默认值               | 相关函数                                |
|-------|-------------------|-------------------------------------|
| 颜色缓存区 | （0.0，0.0，0.0，0.0） | gl.clearColor(red,green,blue,alpha) |
| 深度缓冲区 | 1.0               |gl.clearDepth(depth)|
| 模版缓冲区 | 0                 |gl.clearStencil(s)|
