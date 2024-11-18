const VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'void main() {\n' +
    'gl_PointSize = 10.0;\n' +
    'gl_Position = a_Position;\n' +
    '}\n'
const FSHADER_SOURCE =
    // 'void main() {\n' +
    // 'gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
    // '}\n'
    'precision mediump float;\n'+
    'uniform float u_Width;\n'+
    'uniform float u_Height;\n' +
    'void main(){' +
    'gl_FragColor = vec4(gl_FragCoord.x/u_Width, 0.0, gl_FragCoord.y/u_Height, 1.0);\n' +
    '}'


function main() {
    const canvas = document.getElementById('webgl')

    const gl = getWebGLContext(canvas)

    if(!gl) {
        console.error('Failed to get the rendering context for WebGL')
        return;
    }

    if(!initShaders(gl,VSHADER_SOURCE, FSHADER_SOURCE )) {
        console.error('Failed to  initialize shaders.')
    }

    const n = initVertexBuffers(gl)
    console.log(n)
    if(n < 0) {
        console.error('Failed to set the positions of the vertices')
    }



    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.drawArrays(gl.TRIANGLES, 0, n)
}

function initVertexBuffers(gl) {
    const vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ])
    let n = 3

    const vertexBuffer = gl.createBuffer()

    if(!vertexBuffer) {
        console.error('Failed to create the buffer object')
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    const a_Position = gl.getAttribLocation(gl.program, 'a_Position')

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)

    gl.enableVertexAttribArray(a_Position)

    const u_Width = gl.getUniformLocation(gl.program, 'u_Width')
    const u_Height = gl.getUniformLocation(gl.program, 'u_Height')

    // 赋值
    gl.uniform1f(u_Width, gl.drawingBufferWidth)
    gl.uniform1f(u_Height, gl.drawingBufferHeight/400)

    return n
}