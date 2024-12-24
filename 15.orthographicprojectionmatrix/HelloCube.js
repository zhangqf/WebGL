const VSHADER_SOURCE=
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'uniform mat4 u_MvpMatrix;\n' +
    'varying vec4 v_Color;\n' +
    'void main(){' +
    'gl_Position = u_MvpMatrix * a_Position;\n' +
    'v_Color = a_Color;\n' +
    '}'

const FSHADER_SOURCE =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'varying vec4 v_Color;\n' +
    'void main(){' +
    'gl_FragColor = v_Color;\n' +
    '}'

function main() {
    const canvas = document.querySelector('canvas')
    const gl = canvas.getContext('webgl')
    if(!gl) {
        console.error('Unable to initialize WebGL.')
        return
    }

    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('Failed to initialize shaders.')
        return;
    }
    const n = initVertexBuffers(gl)

    if(n < 0) {
        console.error('Failed to initvertexBuffer ')

        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.enable(gl.DEPTH_TEST)

    const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix')

    const mvpMatrix = new Matrix4()

    mvpMatrix.setPerspective(30, 1, 1, 100)

    mvpMatrix.lookAt(3,3,7,0,0,0,0,1,0)

    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    gl.drawElements(gl.TRIANGLES,n,gl.UNSIGNED_BYTE,0)
}

function initVertexBuffers(gl) {
    const verticesColors = new Float32Array([
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, // v0
        -1.0, 1.0, 1.0, 1.0, 0.0, 1.0, // v1
        -1.0, -1.0, 1.0, 1.0, 0.0, 0.0, // v2
        1.0, -1.0, 1.0, 1.0, 1.0, 0.0, // v3
        1.0, -1.0, -1.0, 0.0, 1.0, 0.0, // v4
        1.0, 1.0, -1.0, 0.0, 1.0, 1.0, // v5
        -1.0, 1.0, -1.0, 0.0, 0.0, 1.0, // v6
        -1.0, -1.0, -1.0, 0.0, 0.0, 0.0  // v7
    ])

    const indices = new Uint8Array([
        0, 1, 2, 0, 2, 3, // 前
        0, 3, 4, 0, 4, 5, // 右
        0, 5, 6, 0, 6, 1, // 上
        1, 6, 7, 1, 7, 2, // 左
        7, 4, 3, 7, 3, 2, // 下
        4, 7, 6, 4, 6, 5, // 后
    ])

    const vertexColorBuffer = gl.createBuffer();
    const indexBuffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW)
    const FSIZE = verticesColors.BYTES_PER_ELEMENT

    const a_Position = gl.getAttribLocation(gl.program, 'a_Position')

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0)

    gl.enableVertexAttribArray(a_Position)

    const a_Color = gl.getAttribLocation(gl.program, 'a_Color')

    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3)

    gl.enableVertexAttribArray(a_Color)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

    return indices.length;


}