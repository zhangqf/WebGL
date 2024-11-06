const VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform vec4 u_Translation;\n' +
    'void main() {\n' +
        'gl_Position = a_Position + u_Translation;\n' +
    '}\n'
const FSHADER_SOURCE =
   ' void main() {\n'+
        'gl_FragColor = vec4(1.0, 1.0, 0.0,1.0);\n'+
    '}\n'

// 在 x y z 方向上平移的距离

var Tx = 0.5, Ty = 0.5, Tz= 0.0;

function main() {
    var canvas = document.getElementById('webgl')
    var gl = getWebGLContext(canvas)
    if(!gl) {
        console.error('Failed to get the rendering context for WebGL')
        return;
    }

    // 初始化着色器
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('Failed to initialize shaders.')
        return;
    }

    // 设置顶点着色器
    var n = initVertexBuffers(gl);


    var u_Translation = gl.getUniformLocation(gl.program, 'u_Translation');
    gl.uniform4f(u_Translation, Tx, Ty, Tz, 0.0)

    if(n < 0) {
        console.error('Failed to set the positions of the vertices')
        return;
    }

    // // 获取attribut变量的存储位置
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    //
    // var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor')
    if(a_Position < 0) {
        console.error('Failed to get the storage location of a_Position')
        return;
    }
    //
    // canvas.onmousedown = function (ev) {click(ev, gl, canvas, a_Position, u_FragColor)}



    // gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0)

    // 设置canvas背景色
    gl.clearColor(0.0,0.0,0.0,1.0)

    // 清空canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 绘制三个点
    gl.drawArrays(gl.TRIANGLE_FAN, 0, n)


}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5
    ])
    var n = 4 // 点的个数

    // 创建缓冲区对象
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer) {
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



