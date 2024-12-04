const VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'uniform mat4 u_ProjMatrix;\n' +
    'varying vec4 v_Color;\n' +
    'void main(){\n' +
    'gl_Position = u_ProjMatrix * a_Position;\n' +
    'v_Color = a_Color;\n' +
    '}\n'

const FSHADER_SOURCE =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'varying vec4 v_Color;\n' +
    'void main(){\n' +
    'gl_FragColor = v_Color;\n' +
    '}\n'

function main() {
    const canvas = document.querySelector('canvas')
    const nf = document.getElementById('nearFar')

    const gl = canvas.getContext('webgl')

    if(!gl) {
        console.error('Unable to initialize WebGL.')
        return
    }

    if(!initShaders(gl, VSHADER_SOURCE,FSHADER_SOURCE)) {
        console.error('Failed to initialize shaders.')
    }

    const n = initVertexBuffers(gl);

    if(n < 0) {
        console.error('Faild to initialize shaders.')
    }
    const u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix')

    const projMatrix = new Matrix4()
    document.onkeydown = function (ev) {
        onkeydown(ev, gl, n, u_ProjMatrix, projMatrix, nf)
    }

    draw(gl,n,u_ProjMatrix, projMatrix,nf)


}

let g_near = 0.0, g_far=0.5;
function onkeydown(ev, gl, n, u_ProjMatrix, projMatrix,nf) {
    switch (ev.keyCode) {
        case 39: g_near += 0.01; break;
        case 37: g_near -= 0.01; break;
        case 38: g_far += 0.01; break;
        case 40: g_far -= 0.01; break;
        default: return;
    }
    draw(gl, n, u_ProjMatrix, projMatrix, nf)
}

function initVertexBuffers(gl) {
    const verticesColors = new Float32Array([
        // 最后边绿色三角形
        0.0, 0.5, -0.4, 0.4, 1.0, 0.4,
        -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
        0.5, -0.5, -0.4, 1.0, 0.4, 0.4,

        // 中间的黄色三角形
        0.5, 0.4, -0.2, 1.0, 0.4, 0.4,
        -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
        0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

        // 最前边的蓝色山角形
        0.0, 0.5, 0.0, 0.4, 0.4, 1.0,
        -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
        0.5, -0.5, 0.0, 1.0, 0.4, 0.4,
    ])
    const n = 9
    const size = verticesColors.BYTES_PER_ELEMENT

    // 创建缓冲区
    const vertexColorBuffer = gl.createBuffer()
    // 绑定缓冲区
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer)
    // 向缓冲区写入数据
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW)

    // 获取attribute变量
    // const a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    // 将缓冲区数据分配给变量
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, size * 6, 0)
    // 开启变量 方便着色器访问缓冲区内的数据
    gl.enableVertexAttribArray(a_Position)

    const a_Color = gl.getAttribLocation(gl.program, 'a_Color')
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, size * 6, size*3)
    gl.enableVertexAttribArray(a_Color)

    return n
}

function draw(gl,n, u_ProjMatrix, projMatrix,nf) {

    projMatrix.setOrtho(-1,1,-1,1, g_near ,g_far)

    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements)

    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    gl.clear(gl.COLOR_BUFFER_BIT)

    nf.innerHTML = 'near:' + Math.round(g_near * 100) /100 + ',far:' + Math.round(g_far * 100) /100;

    gl.drawArrays(gl.TRIANGLES, 0, n)
}