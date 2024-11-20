const VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec2 a_TexCoord;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main() {\n' +
    'v_TexCoord = a_TexCoord;\n' +
    'gl_Position = a_Position;\n' +
    // 'gl.PositSize = 30.0;\n' +
    '}\n';
const FSHADER_SOURCE =
    'precision mediump float;\n'+
    // 'uniform float u_Width;\n'+
    // 'uniform float u_Height;\n' +
    'uniform sampler2D u_Sampler;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main(){' +
    'gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' +
    '}';

// import textture from '../images/textture.jpeg'/

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
    if(n < 0) {
        console.error('Failed to set the positions of the vertices')
    }

    if(!initTextures(gl,n)) {
        console.error('Failed to initialize Texture')
    }



}

function initVertexBuffers(gl) {
    const verticesTexCoords = new Float32Array([
        // 顶点坐标  纹理坐标
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0
    ])
    let n = 4

    const vertexTexCoordBuffer = gl.createBuffer()

    if(!vertexTexCoordBuffer) {
        console.error('Failed to create the buffer object')
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer)

    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW)

    var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT



    const a_Position = gl.getAttribLocation(gl.program, 'a_Position')

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0)

    gl.enableVertexAttribArray(a_Position)

    const a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord')

    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2)
    gl.enableVertexAttribArray(a_TexCoord)


    return n
}

function initTextures(gl, n) {
    const texture = gl.createTexture() // 创建纹理对象

    const u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler') // 获取u_Sampler的存储位置

    const image = new Image() // 创建一个image对象

    image.onload = function () {
        loadTexture(gl, n, texture, u_Sampler, image);
        console.log(333)
    }

    image.onerror = function() {
        console.error('Failed to load image at ' + image.src);
    };
    image.src = 'https://webglfundamentals.org/webgl/resources/f-texture.png';
    // image.src='http://127.0.0.1:5501/images/vshaderAndFshader.png'
    image.setAttribute("crossOrigin", "Anonymous");
    return true;
}

function loadTexture(gl, n, texture, u_Sampler, image) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1) // 对纹理图像进行y轴反转

    gl.activeTexture(gl.TEXTURE0)

    gl.bindTexture(gl.TEXTURE_2D, texture)

    // 配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

    gl.uniform1i(u_Sampler, 0)

    console.log('Texture loaded:', image.width, image.height);


    // gl.drawArrays(gl.TRIANGLES, 0, n)
    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n)
}