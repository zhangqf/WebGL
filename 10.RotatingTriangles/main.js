const VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_ModelMatrix;\n' +
    'void main() {\n' +
    'gl_Position = u_ModelMatrix * a_Position;\n' +
    // 'gl_PointSize = 10.0;\n' +
    '}\n'
const FSHADER_SOURCE =
    ' void main() {\n' +
    'gl_FragColor = vec4(1.0, 1.0, 0.0,1.0);\n' +
    '}\n'


var ANGLE = 90.0

var ANGLE_STEP = 45.0

function main() {
    var canvas = document.getElementById('webgl')
    var gl = getWebGLContext(canvas)
    if (!gl) {
        console.error('Failed to get the rendering context for WebGL')
        return;
    }

    // 初始化着色器
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('Failed to initialize shaders.')
        return;
    }

    // 设置顶点着色器
    var n = initVertexBuffers(gl);



    if (n < 0) {
        console.error('Failed to set the positions of the vertices')
        return;
    }

    // gl.clearColor(0.0, 0.0, 0.0, 1.0)

    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix')

    var currentAngle = 0.0

    var modelMatrix = new Matrix4()

    var tick = function () {
        currentAngle = animate(currentAngle) // 更新旋转角
        draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix)

        requestAnimationFrame(tick)

    }
    tick()
    var Tx = 0.5

    // 平移旋转
    modelMatrix.setRotate(ANGLE, 0, 0, 1)
    modelMatrix.translate(Tx, 0.5, 1)

    // 旋转平移
    // modelMatrix.setTranslate(Tx, 0.5, 1)
    // modelMatrix.rotate(ANGLE, 0, 0, 1)



    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)



    // 获取attribut变量的存储位置
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    //
    // var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor')
    if (a_Position < 0) {
        console.error('Failed to get the storage location of a_Position')
        return;
    }

    canvas.onmousedown = function (ev) {click(ev, gl, canvas, a_Position, u_FragColor)}


    gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0)

    // 设置canvas背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    // 清空canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 绘制三个点
    gl.drawArrays(gl.TRIANGLES, 0, n)

}

function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
    // 设置旋转矩阵
    modelMatrix.setRotate(currentAngle, 0, 0, 1)

    // // 平移旋转
    // modelMatrix.setRotate(ANGLE, 0, 0, 1)
    modelMatrix.translate(0.35, 0.5, 1)

    // 将旋转矩阵传输给顶点着色器
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)

    // 清除 canvas
    gl.clear(gl.COLOR_BUFFER_BIT)

    // 绘制三角形

    gl.drawArrays(gl.TRIANGLES, 0, n)
}

var g_last = Date.now()

function animate(angle) {
    var now = Date.now()

    var elapsed = now - g_last;

    g_last = now

    var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0

    return newAngle %= 360
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5
    ])
    var n = 4 // 点的个数

    // 创建缓冲区对象
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.error('Failed to create the buffer object')
        return -1;
    }

    // 将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

    // 向缓冲区对象中写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    // 将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)

    // 连接a_Position变量与分配给它的缓冲对象
    gl.enableVertexAttribArray(a_Position)
    return n
}



