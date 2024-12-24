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
    const vertices = new Float32Array([
        // front
        1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0,1.0, -1.0, 1.0, // 0 1 2 3

        // right
        1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, // 0 3 4 5

        // up
        1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, // 0 5 6 2

        // left
        -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0,-1.0, -1.0, 1.0, // 1 6 7 2

        //down
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0,-1.0, -1.0, 1.0, // 7 4 3 2


        //back
        -1.0, -1.0, -1.0,  1.0, -1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0// 7 4 5 6

    ])
    const colors = new Float32Array([
        0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0,
        0.4, 1.0, 0.4, 0.4, 1.0, 0.4,0.4, 1.0, 0.4,0.4, 1.0, 0.4,
        1.0, 0.4, 0.4, 1.0, 0.4, 0.4,1.0, 0.4, 0.4,1.0, 0.4, 0.4,
        1.0, 1.0, 0.4,1.0, 1.0, 0.4,1.0, 1.0, 0.4,1.0, 1.0, 0.4,
        0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0,
        0.4, 1.0, 1.0,0.4, 1.0, 1.0,0.4, 1.0, 1.0,0.4, 1.0, 1.0,
    ])

    const indices = new Uint8Array([
        0, 1, 2, 0, 2, 3, // 前
        4, 5, 6, 4, 6, 7, // 右
        8,9,10, 8,10,11, // 上
        12, 13, 14, 12, 14, 15, // 左
        16, 17, 18, 16, 18, 19, // 下
        20, 21, 22, 20, 22, 23, // 后
    ])

    if(!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position')) {
        console.log(32)
        return  -1;
    }


    if(!initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color')) {
        console.log(43)
        return -1;
    }

    const indexBuffer = gl.createBuffer()

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

    return indices.length;


}

function initArrayBuffer(gl, data, num, type, attribute) {
    const buffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)

    const a_attribute = gl.getAttribLocation(gl.program, attribute)

    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0)
    gl.enableVertexAttribArray(a_attribute)
    return true
}