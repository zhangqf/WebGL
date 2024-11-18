const VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    'gl_Position = a_Position;\n' +
    'gl_PointSize = 10.0;\n' +
    'v_Color = a_Color;\n' +  // 将数据传给片元着色器
    '}\n';
const FSHADER_SOURCE =
    '#ifdef GL_ES\n' +
        'precision mediump float;\n' + //精度限定，中精度
        '#endif\n' +
    'varying vec4 v_Color;\n' +
    ' void main() {\n' +
    'gl_FragColor = v_Color;\n' + // 从顶点着色器接收数据
    '}\n'

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

    // 获取attribut变量的存储位置
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position')


    if (a_Position < 0) {
        console.error('Failed to get the storage location of a_Position')
        return;
    }

    // 设置canvas背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    // 清空canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 绘制三个点
    gl.drawArrays(gl.TRIANGLES, 0, n)

}


function initVertexBuffers(gl) {
    // var verticesSizes = new Float32Array([
    //     0.0, 0.5,10.0, -0.5,-0.5,20.0, 0.5,-0.5,30.0
    // ])

    var verticesColors = new Float32Array([
        // 顶点坐标和颜色
        0.0, 0.5, 1.0, 0.0, 0.0,
        -0.5, -0.5, 0.0, 1.0, 0.0,
        0.5, -0.5, 0.0, 0.0, 1.0
    ])

    var n =3 // 点的个数

    // 创建缓冲区对象
    // var vertexSizeBuffer = gl.createBuffer();

    var vertexColorBuffer = gl.createBuffer();
    if (!vertexColorBuffer) {
        console.error('Failed to create the buffer object')
        return -1;
    }

    // 将缓冲区对象绑定到目标
    // gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer)

    // 向缓冲区对象中写入数据
    // gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW);

    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW)

    var FSIZE = verticesColors.BYTES_PER_ELEMENT  //数组中每个元素所占的字节数

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');


    // 将缓冲区对象分配给a_Position变量
    // gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 3, 0)  // FSIZE * 3 即指定相邻两个顶点间的字节数，默认为0

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0)

    // 连接a_Position变量与分配给它的缓冲对象
    gl.enableVertexAttribArray(a_Position) // 开启分配


    // var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');

    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');

    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2)

    // gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 3,  FSIZE * 2)
    // gl.enableVertexAttribArray(a_PointSize)

    gl.enableVertexAttribArray(a_Color)



    return n
}


