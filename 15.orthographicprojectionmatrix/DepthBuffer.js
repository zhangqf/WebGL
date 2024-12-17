const VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'uniform mat4 u_MvpMatrix;\n' +
    'varying vec4 v_Color;\n' +
    'void main(){\n' +
    'gl_Position = u_MvpMatrix * a_Position;\n' +
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

function main(){
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

    const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix')

    const mvpMatrix = new Matrix4()
    const viewMatrix = new Matrix4()
    const projMatrix = new Matrix4()
    const modelMatrix = new Matrix4()

    modelMatrix.setTranslate(0.75, 0, 0)
    viewMatrix.setLookAt(0,0,5,0,0,-100,0,1,0)
    projMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100)

    // 计算模型视图投影矩阵
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix)

    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)

    gl.clearColor(0.0,0.0,0.0,1)

    gl.enable(gl.DEPTH_TEST)

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    // gl.clear(gl.COLOR_BUFFER_BIT)

    gl.drawArrays(gl.TRIANGLES, 0, n)

    modelMatrix.setTranslate(-0.75, 0,0)
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix)

    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)

    gl.drawArrays(gl.TRIANGLES, 0, n)
}

function initVertexBuffers(gl) {
    const verticesColors = new Float32Array([

        0.0, 1.0, 0.0, 0.4, 0.4, 1.0,
        -0.5, -1.0, 0.0, 0.4, 0.4, 1.0,
        0.5, -1.0, 0.0, 1.0, 0.4, 0.4,

        0.0, 1.0, -2.0, 1.0, 1.0, 0.4,
        -0.5, -1.0, -2.0, 1.0, 1.0, 0.4,
        0.5, -1.0, -2.0, 1.0, 0.4, 0.4,

        0.0, 1.0, -4.0, 0.4, 1.0, 0.4,
        -0.5, -1.0, -4.0, 0.4, 1.0, 0.4,
        0.5, -1.0, -4.0, 1.0, 0.4, 0.4,

    ])

    const n = 9

    const size = verticesColors.BYTES_PER_ELEMENT

    const vertexColorBuffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer)

    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW)

    const a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, size * 6, 0)
    gl.enableVertexAttribArray(a_Position)

    const a_Color = gl.getAttribLocation(gl.program, 'a_Color')
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, size * 6, size *3)
    gl.enableVertexAttribArray(a_Color)

    return n

}